import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../common/errors.js";
import { logger } from "../common/logger.js";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const message = isAppError ? error.message : "An unexpected error occurred";

  logger.error(
    {
      err: error,
      method: req.method,
      path: req.path,
      statusCode,
    },
    "Request failed",
  );

  res.status(statusCode).json({
    success: false,
    error: {
      code: isAppError ? "APP_ERROR" : "INTERNAL_SERVER_ERROR",
      message,
      ...(env.NODE_ENV === "development" && !isAppError
        ? { debugMessage: error instanceof Error ? error.message : undefined }
        : {}),
    },
  });
};
