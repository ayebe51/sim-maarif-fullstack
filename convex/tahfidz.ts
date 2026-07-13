import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRecordsByStudent = query({
  args: { studentId: v.id("students"), schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tahfidz_records")
      .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("schoolId"), args.schoolId))
      .order("desc")
      .collect();
  },
});

export const addRecord = mutation({
  args: {
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    teacherId: v.id("teachers"),
    tanggal: v.string(),
    surahMulai: v.string(),
    ayatMulai: v.number(),
    surahSelesai: v.string(),
    ayatSelesai: v.number(),
    penilaian: v.string(),
    nilaiAngka: v.optional(v.number()),
    catatanTajwid: v.optional(v.string()),
    keteranganTambahan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const recordId = await ctx.db.insert("tahfidz_records", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Queue WhatsApp Message for Parent
    const student = await ctx.db.get(args.studentId);
    if (student && student.nomorTelepon) {
        await ctx.db.insert("wa_outbox", {
           schoolId: args.schoolId,
           targetNumber: student.nomorTelepon,
           message: `[SIMMACI] Info Tahfidz\nNama: ${student.nama}\nSetoran: ${args.surahMulai} (${args.ayatMulai}) - ${args.surahSelesai} (${args.ayatSelesai})\nNilai: ${args.penilaian}\n\nTerus semangat!`,
           status: "PENDING",
           type: "TAHFIDZ",
           createdAt: Date.now()
        });
    }

    return recordId;
  },
});

export const getTargetsByStudent = query({
  args: { studentId: v.id("students"), schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tahfidz_targets")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("schoolId"), args.schoolId))
      .collect();
  },
});

export const addTarget = mutation({
  args: {
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    targetType: v.string(),
    targetValue: v.string(),
    targetDate: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tahfidz_targets", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
