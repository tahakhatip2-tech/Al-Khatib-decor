import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const inquiriesTable = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  serviceType: text("service_type").notNull(),
  serviceTitle: text("service_title"),
  message: text("message").notNull(),
  address: text("address"),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(CAST(strftime('%s', 'now') AS INTEGER))`),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;
