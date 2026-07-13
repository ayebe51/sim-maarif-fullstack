import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { determineTeacherStatus } from "./utils";
import { Id, Doc } from "./_generated/dataModel";

// Get real-time dashboard statistics
export const getStats = query({
  handler: async (ctx) => {
    const teachers = await ctx.db
      .query("teachers")
      .collect();
    
    const students = await ctx.db
      .query("students")
      .collect();
    
    const schools = await ctx.db
      .query("schools")
      .collect();
    
    // Calculate active counts
    const activeTeachers = teachers.filter(t => t.isActive !== false).length;
    const activeStudents = students.length;
    const activeSchools = schools.length;

    
    const emisSync = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "lastEmisSync"))
      .first();

    // 🟢 CONSOLIDATED LOGS: Fetching here to avoid separate query failures
    let recentLogs: any[] = [];
    try {
      const logs = await ctx.db.query("activity_logs").order("desc").take(15);
      recentLogs = logs.map(l => ({
        _id: String(l._id),
        _creationTime: l._creationTime,
        user: String(l.user || "Unknown"),
        role: String(l.role || "User"),
        action: String(l.action || "Aktivitas"),
        details: String(l.details || "-"),
        timestamp: Number(l.timestamp || l._creationTime),
      }));
    } catch (e) {
      console.error("Error fetching logs in getStats:", e);
    }

    return {
      totalTeachers: activeTeachers,
      totalStudents: activeStudents,
      totalSchools: activeSchools,
      lastUpdated: Date.now(),
      lastEmisSync: emisSync ? emisSync.value : null,
      recentLogs, // Delivered together with statistics
    };
  },
});

// Record EMIS Synchronization event
export const recordEmisSync = mutation({
  args: {
    schoolCount: v.number(),
    failureCount: v.number(),
  },
  handler: async (ctx, args) => {
    const key = "lastEmisSync";
    const now = Date.now();
    const syncData = {
      timestamp: now,
      schoolCount: args.schoolCount,
      failureCount: args.failureCount,
    };

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: JSON.stringify(syncData),
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("settings", {
        key,
        value: JSON.stringify(syncData),
        updatedAt: now,
      });
    }
  },
});

// Get recent activities
export const getRecentActivities = query({
  args: {},
  handler: async (ctx) => {
    return [];
  },
});

// Get charts data for dashboard
export const getChartsData = query({
  handler: async (ctx) => {
    const teachers = await ctx.db
      .query("teachers")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    // Group by unit kerja (case-insensitive)
    const unitMap = new Map<string, number>();
    teachers.forEach(t => {
      if (t.unitKerja) {
        // Normalize to lowercase for grouping
        const normalized = t.unitKerja.toLowerCase().trim();
        unitMap.set(normalized, (unitMap.get(normalized) || 0) + 1);
      }
    });
    
    // Convert to array and get top 5
    const units = Array.from(unitMap.entries())
      .map(([name, jumlah]) => ({ 
        // Capitalize first letter of each word for display
        name: name.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '), 
        jumlah 
      }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);
    
    // Group by status
    const statusMap = new Map<string, number>();
    teachers.forEach(t => {
      const status = t.status || "Tidak Diketahui";
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    
    const status = Array.from(statusMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    return { units, status };
  },
});



// NEW: Stats specifically for School Operators
export const getSchoolStats = query({
  args: { email: v.string() }, // Accept email explicitly because we use custom auth
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity(); // Disabled: Custom Auth
    const email = args.email;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user || user.role !== "operator" || !user.unit) {
      return {
        error: "User validation failed",
        debug: {
            found: !!user,
            role: user?.role,
            unit: user?.unit,
            email: email,
            expectedRole: "operator"
        }
      };
    }

    const schoolName = user.unit;

    // Fetch All Teachers for this School (for aggregation)
    const teachersList = await ctx.db.query("teachers").collect().then(res => res.filter(t => t.unitKerja === schoolName && t.isActive));
    
    // 1. Calculate Teacher Trend (Last 6 Months)
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: d.toLocaleString('id-ID', { month: 'short' }),
            count: 0
        };
    }).reverse();

    for (const t of teachersList) {
        const d = new Date(t.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const bucket = last6Months.find(b => b.monthKey === key);
        if (bucket) {
            bucket.count++;
        }
    }
    const teacherTrend = last6Months.map(({ label, count }) => ({ month: label, count }));

    // 2. Status Breakdown
    const statusCounts: Record<string, number> = { "PNS": 0, "GTY": 0, "GTT": 0, "Tendik": 0 };
    const certCounts: Record<string, number> = { "Sudah Sertifikasi": 0, "Belum Sertifikasi": 0 };

    for (const t of teachersList) {
        if (t.isActive === false) continue;
        
        // A. Status
       // Use shared helper
       const statusLabel = determineTeacherStatus(t);

       if (statusCounts[statusLabel] !== undefined) {
           statusCounts[statusLabel]++;
       }  // B. Certification (Exclude Tendik)
       if (statusLabel !== "Tendik") {
          if (t.isCertified) certCounts["Sudah Sertifikasi"]++;
          else certCounts["Belum Sertifikasi"]++;
       }
    }

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    const certData = Object.entries(certCounts).map(([name, value]) => ({ name, value }));

    // Parallelize other queries
    const [students] = await Promise.all([
      // Student Count
      ctx.db.query("students").collect().then(res => res.filter(s => s.namaSekolah === schoolName).length),
    ]);

    return {
      schoolName,
      teachers: teachersList.length,
      students,
      teacherTrend,
      status: statusData,
      certification: certData,
      lastEmisSync: await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", "lastEmisSync"))
        .first()
        .then(res => res ? res.value : null),
      recentLogs: await ctx.db.query("activity_logs")
        .order("desc")
        .take(10)
        .then(res => res.map(l => ({
            _id: String(l._id),
            _creationTime: l._creationTime,
            user: String(l.user || "Unknown"),
            role: String(l.role || "User"),
            action: String(l.action || "Aktivitas"),
            details: String(l.details || "-"),
            timestamp: Number(l.timestamp || l._creationTime),
        }))),
      debug: { role: user.role, unit: user.unit },
      attendance: await (async () => {
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch schoolId if not directly on user
        let sId = user.schoolId;
        if (!sId && user.unit) {
            const school = await ctx.db
                .query("schools")
                .withIndex("by_nama", (q) => q.eq("nama", user.unit!))
                .first();
            sId = school?._id;
        }

        if (!sId) return null;
        const schoolId = sId;

        // Today's stats
        const todayLogs = await ctx.db
          .query("studentAttendanceLogs")
          .withIndex("by_school_date", (q) => q.eq("schoolId", schoolId).eq("tanggal", today))
          .collect();
        
        const studentsPresent = new Set();
        todayLogs.forEach((log: any) => {
          Object.entries(log.logs || {}).forEach(([sid, entry]: [string, any]) => {
            if (entry.status === "Hadir") studentsPresent.add(sid);
          });
        });

        // 7-day trend (Parallelized)
        const trendPromises = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('id-ID', { weekday: 'short' });
            
            return ctx.db
                .query("studentAttendanceLogs")
                .withIndex("by_school_date", (q) => q.eq("schoolId", schoolId).eq("tanggal", dateStr))
                .collect()
                .then(logs => {
                    const presentCount = new Set();
                    logs.forEach((log: any) => {
                        Object.entries(log.logs || {}).forEach(([sid, entry]: [string, any]) => {
                            if (entry.status === "Hadir") presentCount.add(sid);
                        });
                    });
                    return { date: label, count: presentCount.size };
                });
        });

        const trend = await Promise.all(trendPromises);

        // Proactive Analytics
        const [topAbsent, subjectStats] = await Promise.all([
          // Top Absent Students
          (async () => {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const logs = await ctx.db
              .query("studentAttendanceLogs")
              .withIndex("by_school_date", (q) => q.eq("schoolId", schoolId).gt("tanggal", firstDayOfMonth))
              .collect();
            
            const absentMap: Record<string, { name: string; count: number; types: Record<string, number> }> = {};
            logs.forEach((log: any) => {
               Object.entries(log.logs || {}).forEach(([sid, entry]: [string, any]) => {
                  if (entry.status !== "Hadir") {
                     if (!absentMap[sid]) absentMap[sid] = { name: entry.name || sid, count: 0, types: {} };
                     absentMap[sid].count++;
                     absentMap[sid].types[entry.status] = (absentMap[sid].types[entry.status] || 0) + 1;
                  }
               });
            });

            // Fetch student names for resolution
            const resolvedNames: Record<string, string> = {};
            
            // Try to find the school record to get NPSN for better matching
            const schoolRecord = await ctx.db
                .query("schools")
                .withIndex("by_nama", (q) => q.eq("nama", schoolName))
                .first();

            // Collect all students for this school to build a name map
            let allSchoolStudents: any[] = [];
            if (schoolRecord?.npsn) {
                allSchoolStudents = await ctx.db
                    .query("students")
                    .withIndex("by_npsn", (q) => q.eq("npsn", schoolRecord.npsn))
                    .collect();
            }
            
            if (allSchoolStudents.length === 0) {
                allSchoolStudents = await ctx.db
                    .query("students")
                    .withIndex("by_school", (q) => q.eq("namaSekolah", schoolName))
                    .collect();
            }
            
            allSchoolStudents.forEach(s => {
              if (s.nisn) resolvedNames[String(s.nisn)] = s.nama;
              resolvedNames[s._id] = s.nama;
            });

            return Object.entries(absentMap)
               .map(([sid, stats]) => ({
                 ...stats,
                 name: resolvedNames[sid] || sid
               }))
               .sort((a, b) => b.count - a.count)
               .slice(0, 5);
          })(),
          // Subject Performance
          (async () => {
             const allLogs = await ctx.db
               .query("studentAttendanceLogs")
               .withIndex("by_school_date", (q) => q.eq("schoolId", schoolId))
               .order("desc")
               .take(100);

             const subjectMap: Record<string, { name: string; present: number; total: number }> = {};
             allLogs.forEach((log: any) => {
                const sId = String(log.subjectId);
                if (!subjectMap[sId]) subjectMap[sId] = { name: "Loading...", present: 0, total: 0 };
                
                Object.values(log.logs || {}).forEach((entry: any) => {
                   subjectMap[sId].total++;
                   if (entry.status === "Hadir") subjectMap[sId].present++;
                });
             });

             const results = await Promise.all(Object.entries(subjectMap).map(async ([id, stats]) => {
                const sub = await ctx.db.get(id as Id<"subjects">);
                return {
                   name: (sub as Doc<"subjects">)?.nama || "Unknown",
                   percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
                };
             }));

             return results.sort((a, b) => a.percentage - b.percentage).slice(0, 5);
          })()
        ]);

        return {
          todayPercentage: students > 0 ? Math.round((studentsPresent.size / students) * 100) : 0,
          todayCount: studentsPresent.size,
          trend,
          topAbsent,
          subjectStats
        };
      })()
    };
  }
});

// PERMANENT FIX: Redundant query removed. Logs are now consolidated in getStats.
