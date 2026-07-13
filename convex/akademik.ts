import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth_helpers";

export const inputScore = mutation({
  args: {
    studentId: v.id("students"),
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    teacherId: v.id("teachers"),
    semester: v.string(), // "Ganjil" | "Genap"
    academicYear: v.string(),
    type: v.string(), // "UH", "PTS", "PAS"
    score: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if score already exists
    const existing = await ctx.db
      .query("exam_scores")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) =>
        q.and(
          q.eq(q.field("subjectId"), args.subjectId),
          q.eq(q.field("semester"), args.semester),
          q.eq(q.field("academicYear"), args.academicYear),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("exam_scores", {
        ...args,
        createdAt: Date.now(),
      });
    }
  },
});

export const getScores = query({
  args: {
    classId: v.optional(v.id("classes")),
    subjectId: v.optional(v.id("subjects")),
    semester: v.optional(v.string()),
    academicYear: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.classId || !args.subjectId) return [];

    const scores = await ctx.db
      .query("exam_scores")
      .filter((q) =>
        q.and(
          q.eq(q.field("classId"), args.classId),
          q.eq(q.field("subjectId"), args.subjectId),
          args.semester ? q.eq(q.field("semester"), args.semester) : q.eq(true, true),
          args.academicYear ? q.eq(q.field("academicYear"), args.academicYear) : q.eq(true, true),
          args.type ? q.eq(q.field("type"), args.type) : q.eq(true, true)
        )
      )
      .collect();

    // Join with student data
    const result = [];
    for (const score of scores) {
      const student = await ctx.db.get(score.studentId);
      if (student) {
        result.push({
          ...score,
          studentName: student.nama,
          studentNisn: student.nisn,
        });
      }
    }
    
    return result;
  },
});
