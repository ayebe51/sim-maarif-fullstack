import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/ping",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("pong", { status: 200 });
  }),
});

http.route({
  path: "/test-repro",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Pick a teacher to test with
    const teacher = await ctx.runQuery(api.teachers.list, { paginationOpts: { numItems: 1, cursor: null } });
    const tId = teacher.page[0]?._id;
    
    if (!tId) return new Response("No teachers found to test", { status: 404 });

    const res1 = await ctx.runMutation(api.repro_issue.testTeacherUpdate, { teacherId: tId, testEmptySchoolId: true });
    const res2 = await ctx.runMutation(api.repro_issue.testSkGen, { testEmptySchoolId: true });
    
    return new Response(JSON.stringify({ teacherUpdate: res1, skGen: res2 }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/wa/pending",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Basic auth or token check could go here
    const messages = await ctx.runQuery(api.whatsapp.getPendingMessages, { limit: 50 });
    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/wa/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { messageId, status, errorMessage } = await request.json();
    if (!messageId || !status) {
      return new Response("Missing required fields", { status: 400 });
    }
    await ctx.runMutation(api.whatsapp.updateMessageStatus, { 
      messageId: messageId as any, 
      status, 
      errorMessage 
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/pg/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { transactionId, status } = await request.json();
    if (!transactionId || !status) {
      return new Response("Missing fields", { status: 400 });
    }
    
    // We import api at top of file, we can use it here
    // Wait, billing is not yet exported? Oh yes it is exported if file exists
    await ctx.runMutation(api.billing.handlePaymentWebhook, {
      transactionId: transactionId as any,
      status
    });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

export default http;
