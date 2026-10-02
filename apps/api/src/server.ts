import { app } from "./app.js";
import { logger } from "./common/logger.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    "AI Translate API started",
  );
});

function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down API");

  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "Error while closing server");
      process.exitCode = 1;
    }

    process.exit();
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
