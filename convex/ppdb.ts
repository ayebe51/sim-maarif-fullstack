import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    schoolId: v.id("schools"),
    studentName: v.string(),
    nisn: v.optional(v.string()),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real scenario, handle document upload here as well
    const id = await ctx.db.insert("ppdb_registrations", {
      schoolId: args.schoolId,
      studentName: args.studentName,
      nisn: args.nisn,
      phone: args.phone,
      status: "PENDING",
      createdAt: Date.now(),
    });
    
    // Auto-send WA to the registrant
    const school = await ctx.db.get(args.schoolId);
    if (school) {
        await ctx.db.insert("wa_outbox", {
            schoolId: args.schoolId,
            destination: args.phone,
            message: `Terima kasih Bapak/Ibu dari ${args.studentName}. Pendaftaran PPDB di ${school.nama} telah kami terima dan sedang dalam proses verifikasi.`,
            status: "PENDING",
            type: "OTHER",
            createdAt: Date.now(),
        });
    }
    
    return id;
  }
});

export const getRegistrations = query({
  args: {
    schoolId: v.optional(v.id("schools")),
  },
  handler: async (ctx, args) => {
    if (!args.schoolId) return [];
    return await ctx.db
      .query("ppdb_registrations")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .order("desc")
      .collect();
  }
});

export const updateStatus = mutation({
    args: {
        registrationId: v.id("ppdb_registrations"),
        status: v.string() // "VERIFIED" | "REJECTED"
    },
    handler: async (ctx, args) => {
        const reg = await ctx.db.get(args.registrationId);
        if (!reg) throw new Error("Not found");
        
        await ctx.db.patch(args.registrationId, { status: args.status });
        
        // Notify user
        const school = await ctx.db.get(reg.schoolId);
        if (school && args.status === "VERIFIED") {
            await ctx.db.insert("wa_outbox", {
                schoolId: reg.schoolId,
                destination: reg.phone,
                message: `Selamat! Pendaftaran ananda ${reg.studentName} di ${school.nama} telah DITERIMA (Verifikasi Berhasil). Silakan datang ke sekolah untuk proses daftar ulang.`,
                status: "PENDING",
                type: "OTHER",
                createdAt: Date.now(),
            });
        }
        return true;
    }
});
