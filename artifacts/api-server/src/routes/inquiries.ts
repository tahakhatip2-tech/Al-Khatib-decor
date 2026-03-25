import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { SubmitInquiryBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  try {
    const body = SubmitInquiryBody.parse(req.body);
    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail ?? null,
        serviceType: body.serviceType,
        serviceTitle: body.serviceTitle ?? null,
        message: body.message,
        address: body.address ?? null,
        status: "new",
      })
      .returning();
    res.status(201).json({
      ...inquiry,
      createdAt: inquiry.createdAt.toISOString(),
      customerEmail: inquiry.customerEmail ?? undefined,
      serviceTitle: inquiry.serviceTitle ?? undefined,
      address: inquiry.address ?? undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Error submitting inquiry");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await db
      .select()
      .from(inquiriesTable)
      .orderBy(desc(inquiriesTable.createdAt));
    res.json(
      inquiries.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        customerEmail: i.customerEmail ?? undefined,
        serviceTitle: i.serviceTitle ?? undefined,
        address: i.address ?? undefined,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
