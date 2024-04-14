import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(402).json({ error: error.array() });
  }
  next();
};
