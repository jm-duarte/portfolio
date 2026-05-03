import { Router } from "express";
import { db, portfolioItemsTable, aboutSettingsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/portfolio/items", async (req, res) => {
  const category = req.query["category"] as string | undefined;
  const items = await db
    .select()
    .from(portfolioItemsTable)
    .where(category ? eq(portfolioItemsTable.category, category) : undefined)
    .orderBy(asc(portfolioItemsTable.order_index));
  res.json(items.filter((i) => i.published));
});

router.get("/portfolio/about", async (_req, res) => {
  const rows = await db.select().from(aboutSettingsTable).limit(1);
  res.json(rows[0] ?? null);
});

export default router;
