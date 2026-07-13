import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth_helpers";

export const getInvoices = query({
  args: {
    schoolId: v.optional(v.id("schools")),
  },
  handler: async (ctx, args) => {
    if (!args.schoolId) return [];
    
    const invoices = await ctx.db
      .query("spp_invoices")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .order("desc")
      .collect();
      
    // Join with student
    return await Promise.all(invoices.map(async (inv) => {
        const student = await ctx.db.get(inv.studentId);
        return {
            ...inv,
            studentName: student?.nama || "Unknown",
            studentNisn: student?.nisn || "-"
        };
    }));
  }
});

export const createInvoice = mutation({
  args: {
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    title: v.string(),
    amount: v.number(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("spp_invoices", {
      ...args,
      status: "UNPAID",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
});

export const payInvoice = mutation({
  args: {
    invoiceId: v.id("spp_invoices"),
    amountPaid: v.number(),
    paymentMethod: v.string(), // "CASH", "TRANSFER"
    recordedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    // Insert payment record
    await ctx.db.insert("spp_payments", {
      invoiceId: invoice._id,
      studentId: invoice.studentId,
      schoolId: invoice.schoolId,
      amountPaid: args.amountPaid,
      paymentMethod: args.paymentMethod,
      paymentDate: Date.now(),
      recordedBy: args.recordedBy,
    });

    // Determine new status (simplistic: full payment = PAID)
    const newStatus = args.amountPaid >= invoice.amount ? "PAID" : "PARTIAL";

    await ctx.db.patch(invoice._id, {
      status: newStatus,
      updatedAt: Date.now(),
    });

    // Optional: Send WA notification for payment receipt here
    
    return { success: true };
  }
});

// INTERNAL MUTATIONS FOR CRON JOBS
export const generateMonthlySpp = internalMutation({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").filter((q) => q.eq(q.field("status"), "AKTIF")).collect();
    
    const now = new Date();
    const month = now.toLocaleString('id-ID', { month: 'long' });
    const year = now.getFullYear();
    const title = `SPP ${month} ${year}`;
    
    // Set due date to 10th of current month
    const dueDate = new Date(year, now.getMonth(), 10).getTime();
    
    let createdCount = 0;
    for (const student of students) {
        // Check if invoice already exists for this month
        const existing = await ctx.db
            .query("spp_invoices")
            .withIndex("by_student", (q) => q.eq("studentId", student._id))
            .filter((q) => q.eq(q.field("title"), title))
            .first();
            
        if (!existing && student.schoolId) {
            await ctx.db.insert("spp_invoices", {
                studentId: student._id,
                schoolId: student.schoolId,
                title,
                amount: 150000, // Hardcoded default SPP amount for now, should ideally be in school settings or student profile
                dueDate,
                status: "UNPAID",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            createdCount++;
        }
    }
    console.log(`Generated ${createdCount} SPP invoices for ${title}.`);
  }
});

export const sendSppReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Find UNPAID invoices that are past their due date
    const now = Date.now();
    const unpaidInvoices = await ctx.db
      .query("spp_invoices")
      .filter((q) => q.and(
          q.eq(q.field("status"), "UNPAID"),
          q.lt(q.field("dueDate"), now)
      ))
      .collect();
      
    let reminderCount = 0;
    for (const inv of unpaidInvoices) {
        const student = await ctx.db.get(inv.studentId);
        if (student && student.phone_guardian) {
            const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(inv.amount);
            const message = `Yth. Bapak/Ibu Wali dari ${student.nama},\n\nKami menginformasikan bahwa tagihan *${inv.title}* sebesar ${formattedAmount} telah melewati jatuh tempo.\nMohon segera melakukan pembayaran.\n\nAbaikan pesan ini jika sudah membayar. Terima kasih.`;
            
            await ctx.db.insert("wa_outbox", {
                schoolId: inv.schoolId,
                destination: student.phone_guardian,
                message: message,
                status: "PENDING",
                type: "BILLING",
                createdAt: Date.now()
            });
            reminderCount++;
        }
    }
    console.log(`Queued ${reminderCount} SPP reminder WA messages.`);
  }
});
