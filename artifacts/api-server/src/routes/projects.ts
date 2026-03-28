import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { authMiddleware } from "../middlewares/auth";

const router: IRouter = Router();

const formatProject = (p: typeof projectsTable.$inferSelect) => ({
  ...p,
  images: (p.images ?? []) as string[],
  features: (p.features ?? []) as string[],
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
  location: p.location ?? undefined,
  completionDate: p.completionDate ?? undefined,
  area: p.area ?? undefined,
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id));
    res.json(projects.map(formatProject));
  } catch (err) {
    req.log.error({ err }, "Error fetching projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Error fetching project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, completionDate, area, images, features, isActive, isFeatured, sortOrder } = req.body;
    const [project] = await db.insert(projectsTable).values({
      title,
      description,
      category,
      location: location ?? null,
      completionDate: completionDate ?? null,
      area: area ?? null,
      images: images ?? [],
      features: features ?? [],
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
    }).returning();
    res.status(201).json(formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Error creating project");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.put("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, category, location, completionDate, area, images, features, isActive, isFeatured, sortOrder } = req.body;
    const [project] = await db.update(projectsTable).set({
      title,
      description,
      category,
      location: location ?? null,
      completionDate: completionDate ?? null,
      area: area ?? null,
      images: images ?? [],
      features: features ?? [],
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, id)).returning();
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Error updating project");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db.delete(projectsTable).where(eq(projectsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Error deleting project");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
