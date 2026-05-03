import { Router, type Request, type Response, type NextFunction } from "express";
import { db, portfolioItemsTable, aboutSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "admin2024";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req: Request, res: Response) => {
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

router.use(requireAdmin);

router.get("/admin/items", async (_req, res) => {
  const items = await db
    .select()
    .from(portfolioItemsTable)
    .orderBy(portfolioItemsTable.order_index);
  res.json(items);
});

router.post("/admin/items", async (req: Request, res: Response) => {
  const body = req.body as {
    category: string; title: string; tags: string[]; gradient: string;
    role: string; year: string; overview: string; order_index: number; published: boolean;
  };
  const [item] = await db.insert(portfolioItemsTable).values(body).returning();
  res.json(item);
});

router.put("/admin/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  const body = req.body as Partial<typeof portfolioItemsTable.$inferInsert>;
  const [item] = await db.update(portfolioItemsTable).set(body).where(eq(portfolioItemsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/admin/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  await db.delete(portfolioItemsTable).where(eq(portfolioItemsTable.id, id));
  res.json({ ok: true });
});

router.put("/admin/items/reorder", async (req: Request, res: Response) => {
  const { order } = req.body as { order: Array<{ id: number; order_index: number }> };
  await Promise.all(
    order.map(({ id, order_index }) =>
      db.update(portfolioItemsTable).set({ order_index }).where(eq(portfolioItemsTable.id, id))
    )
  );
  res.json({ ok: true });
});

router.get("/admin/about", async (_req, res) => {
  const rows = await db.select().from(aboutSettingsTable).limit(1);
  res.json(rows[0] ?? null);
});

router.put("/admin/about", async (req: Request, res: Response) => {
  const body = req.body as Partial<typeof aboutSettingsTable.$inferInsert>;
  const existing = await db.select().from(aboutSettingsTable).limit(1);
  let row;
  if (existing.length > 0) {
    [row] = await db.update(aboutSettingsTable).set(body).where(eq(aboutSettingsTable.id, existing[0]!.id)).returning();
  } else {
    [row] = await db.insert(aboutSettingsTable).values(body as typeof aboutSettingsTable.$inferInsert).returning();
  }
  res.json(row);
});

export default router;
