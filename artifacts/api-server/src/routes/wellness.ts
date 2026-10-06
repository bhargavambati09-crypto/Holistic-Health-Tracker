import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { Router, type IRouter, type RequestHandler } from "express";
import {
  db,
  wellnessSnapshotsTable,
} from "@workspace/db";
import {
  GetWellnessSnapshotResponse,
  SaveWellnessSnapshotBody,
  SaveWellnessSnapshotResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const requireAuth: RequestHandler = (req, res, next) => {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
};

router.get(
  "/wellness/snapshot",
  requireAuth,
  async (req, res): Promise<void> => {
    const userId = getAuth(req).userId;
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const [snapshot] = await db
      .select()
      .from(wellnessSnapshotsTable)
      .where(eq(wellnessSnapshotsTable.userId, userId))
      .limit(1);

    res.json(
      GetWellnessSnapshotResponse.parse({
        payload: snapshot?.payload ?? null,
        updatedAt: snapshot?.updatedAt.toISOString() ?? null,
      }),
    );
  },
);

router.put(
  "/wellness/snapshot",
  requireAuth,
  async (req, res): Promise<void> => {
    const userId = getAuth(req).userId;
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const parsed = SaveWellnessSnapshotBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [snapshot] = await db
      .insert(wellnessSnapshotsTable)
      .values({ userId, payload: parsed.data.payload })
      .onConflictDoUpdate({
        target: wellnessSnapshotsTable.userId,
        set: { payload: parsed.data.payload, updatedAt: new Date() },
      })
      .returning();

    res.json(
      SaveWellnessSnapshotResponse.parse({
        payload: snapshot.payload,
        updatedAt: snapshot.updatedAt.toISOString(),
      }),
    );
  },
);

router.delete(
  "/wellness/snapshot",
  requireAuth,
  async (req, res): Promise<void> => {
    const userId = getAuth(req).userId;
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    await db
      .delete(wellnessSnapshotsTable)
      .where(eq(wellnessSnapshotsTable.userId, userId));
    res.sendStatus(204);
  },
);

export default router;
