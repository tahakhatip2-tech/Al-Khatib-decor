import jwt from "jsonwebtoken";
import { logger } from "./logger";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-1982";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admd@1982";

export interface User {
  email: string;
  role: "admin";
}

export function signToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch (err) {
    logger.error({ err }, "Invalid token");
    return null;
  }
}

export function validateAdminCredentials(email: string, pass: string): boolean {
  return email === ADMIN_EMAIL && pass === ADMIN_PASSWORD;
}
