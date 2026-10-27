// Runs once when the local server starts.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startReminderLoop } = await import("./lib/reminderServer");
  startReminderLoop();
}
