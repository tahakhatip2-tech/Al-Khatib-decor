import { Router } from "express";
import { validateAdminCredentials, signToken } from "../lib/auth";
import { logger } from "../lib/logger";

const router = Router();

/**
 * @summary Login as administrator
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبة" });
  }

  if (validateAdminCredentials(email, password)) {
    const token = signToken({ email, role: "admin" });
    logger.info({ email }, "Admin logged in successfully");
    
    // Send token in cookie for SPA
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // 24 hours
      sameSite: "lax"
    });

    return res.json({ token, user: { email, role: "admin" } });
  }

  logger.warn({ email }, "Failed login attempt");
  return res.status(401).json({ error: "بيانات الاعتماد غير صالحة" });
});

/**
 * @summary Logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;
