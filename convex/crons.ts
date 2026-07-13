import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Generate SPP Invoices every 1st of the month at 00:00 (UTC)
crons.monthly(
  "Generate Monthly SPP Invoices",
  { day: 1, hourUTC: 0, minuteUTC: 0 },
  internal.finance.generateMonthlySpp
);

// Check unpaid SPP every 11th of the month at 08:00 (UTC) to send WA reminders
crons.monthly(
  "Send SPP Reminders",
  { day: 11, hourUTC: 8, minuteUTC: 0 },
  internal.finance.sendSppReminders
);

export default crons;
