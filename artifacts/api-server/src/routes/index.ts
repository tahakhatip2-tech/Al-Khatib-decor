import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import servicesRouter from "./services";
import projectsRouter from "./projects";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(servicesRouter);
router.use(projectsRouter);

export default router;
