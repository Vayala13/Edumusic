// Senior-project rule: always try/catch, and log the stack trace.
export function logError(message, error) {
  console.error(message, error?.stack || error);
}

// Same idea as:
//   if (err) {
//     console.error("Error executing query", err.stack);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// Firebase calls run in the browser, so there is no Express `res`.
// Callers use `status` / `message` the same way an API client would.
export const INTERNAL_SERVER_ERROR = "Internal server error";

export function handleDatabaseError(contextMessage, error) {
  logError(contextMessage, error);
  return {
    status: 500,
    message: INTERNAL_SERVER_ERROR,
  };
}
