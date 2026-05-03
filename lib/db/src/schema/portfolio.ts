import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioItemsTable = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  tags: text("tags").array().notNull().default([]),
  gradient: text("gradient").notNull().default("from-purple-500 to-indigo-600"),
  role: text("role").notNull().default(""),
  year: text("year").notNull().default(""),
  overview: text("overview").notNull().default(""),
  order_index: integer("order_index").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItemsTable).omit({ id: true });
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItemsTable.$inferSelect;

export const aboutSettingsTable = pgTable("about_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("João"),
  bio: text("bio").notNull().default(""),
  avatar_url: text("avatar_url"),
  skills: text("skills").array().notNull().default([]),
  tools: text("tools").array().notNull().default([]),
  experience: jsonb("experience").$type<Array<{ role: string; company: string; period: string }>>().notNull().default([]),
});

export const insertAboutSettingsSchema = createInsertSchema(aboutSettingsTable).omit({ id: true });
export type InsertAboutSettings = z.infer<typeof insertAboutSettingsSchema>;
export type AboutSettings = typeof aboutSettingsTable.$inferSelect;
