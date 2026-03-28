import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import servicesRouter from "./services";
import projectsRouter from "./projects";
import authRouter from "./auth";
import { authMiddleware } from "../middlewares/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);

// Publicly readable content
router.use(servicesRouter);
router.use(projectsRouter);

// Protected routes (Admin only)
// All inquiries are private
router.use("/inquiries", authMiddleware, inquiriesRouter);

// We need to protect the POST/PUT/DELETE on services and projects
// This is best done in those route files or by having separate routers.
// For now, these generic routers expose all methods on the root /api path.
// If I use router.use(servicesRouter) it mounts GET/POST etc on /api/services/.
// To truly protect them without refactoring much, I'll add the middleware to the mutations in those files.

export default router;
