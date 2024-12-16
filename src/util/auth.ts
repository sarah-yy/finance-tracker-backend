import { Account } from "@fin-tracker/models";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Expect Bearer token

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token is invalid or expired
      req.user = user;
      next();
  });
};

export const authorizeAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};