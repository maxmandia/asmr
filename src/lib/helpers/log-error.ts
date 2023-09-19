import { Logger } from "next-axiom";

const log = new Logger();

export async function logError(route: string, message: string, error?: Error) {
  log.error(route, {
    route,
    message,
    stack: error?.stack ?? null,
    error_object: error ?? null,
    timestamp: new Date().toISOString(),
  });

  await log.flush();

  return;
}
