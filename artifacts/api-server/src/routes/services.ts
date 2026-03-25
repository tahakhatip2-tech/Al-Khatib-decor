import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const formatService = (s: typeof servicesTable.$inferSelect) => ({
  ...s,
  images: (s.images ?? []) as string[],
  features: (s.features ?? []) as string[],
  createdAt: s.createdAt.toISOString(),
  updatedAt: s.updatedAt.toISOString(),
  icon: s.icon ?? undefined,
});

router.get("/services", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
    res.json(services.map(formatService));
  } catch (err) {
    req.log.error({ err }, "Error fetching services");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Error fetching service");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { title, description, category, icon, images, features, isActive, sortOrder } = req.body;
    const [service] = await db.insert(servicesTable).values({
      title,
      description,
      category,
      icon: icon ?? null,
      images: images ?? [],
      features: features ?? [],
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0,
    }).returning();
    res.status(201).json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Error creating service");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, category, icon, images, features, isActive, sortOrder } = req.body;
    const [service] = await db.update(servicesTable).set({
      title,
      description,
      category,
      icon: icon ?? null,
      images: images ?? [],
      features: features ?? [],
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0,
      updatedAt: new Date(),
    }).where(eq(servicesTable.id, id)).returning();
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Error updating service");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db.delete(servicesTable).where(eq(servicesTable.id, id)).returning();
    if (!deleted) return res.status(404).json({ error: "Service not found" });
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Error deleting service");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
