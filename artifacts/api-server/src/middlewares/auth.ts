import { Request, Response, NextFunction } from "express";
import { verifyToken, User } from "../lib/auth";
import { logger } from "../lib/logger";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check Authorization header or Cookie
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const tokenFromCookie = req.cookies?.token;
  
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    logger.warn({ url: req.url }, "Request without token");
    res.status(401).json({ error: "الرجاء تسجيل الدخول للمتابعة" });
    return;
  }

  const user = verifyToken(token);
  
  if (!user) {
    logger.warn({ url: req.url }, "Request with invalid token");
    res.status(401).json({ error: "انتهت جلسة العمل، الرجاء تسجيل الدخول مجدداً" });
    return;
  }

  req.user = user;
  next();
}
