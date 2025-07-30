import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getErrorResult } from "./query";

interface JwtDecodedAccount {
  id: string;
}

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Expect Bearer token

  if (!token) {
    return res.status(401).json(getErrorResult("Access token not found. Please provide an access token in the authorization field."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors, user: JwtDecodedAccount) => {
    if (err) {
      return res.status(403).json(getErrorResult("Access token is invalid or expired. Please login to get a new access token"));
    }
    req.user = user;
    next();
  });
};