import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const details = error instanceof AppError ? error.details : undefined;

  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", error.message, error.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: error.message || "Internal server error",
    ...(details ? { details } : {})
  });
}
