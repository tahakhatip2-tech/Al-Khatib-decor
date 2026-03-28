import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const servicesTable = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  images: text("images", { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  features: text("features", { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(CAST(strftime('%s', 'now') AS INTEGER))`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(CAST(strftime('%s', 'now') AS INTEGER))`),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
