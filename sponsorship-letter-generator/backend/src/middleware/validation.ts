import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { ProgramType } from "../types";

export function validateSponsorshipRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { programData, websiteUrl } = req.body ?? {};

  if (!programData || typeof programData !== "object") {
    throw new AppError("programData is required", 400);
  }

  if (!websiteUrl || typeof websiteUrl !== "string") {
    throw new AppError("websiteUrl is required", 400);
  }

  try {
    const parsed = new URL(websiteUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new AppError("websiteUrl must start with http or https", 400);
    }
  } catch {
    throw new AppError("websiteUrl is not a valid URL", 400);
  }

  const requiredFields = ["name", "type", "description", "goals"] as const;

  for (const field of requiredFields) {
    if (!programData[field] || typeof programData[field] !== "string") {
      throw new AppError(`programData.${field} is required`, 400);
    }
  }

  if (!Object.values(ProgramType).includes(programData.type)) {
    throw new AppError(
      `programData.type must be one of: ${Object.values(ProgramType).join(", ")}`,
      400
    );
  }

  next();
}
