import type { RequestHandler } from "express";
import { AppError } from "../common/errors.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
};
