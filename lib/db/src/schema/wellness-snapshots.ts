import { createInsertSchema } from "drizzle-zod";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const wellnessSnapshotsTable = pgTable("wellness_snapshots", {
  userId: text("user_id").primaryKey(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertWellnessSnapshotSchema = createInsertSchema(
  wellnessSnapshotsTable,
).omit({ updatedAt: true });

export type InsertWellnessSnapshot = z.infer<
  typeof insertWellnessSnapshotSchema
>;
export type WellnessSnapshot = typeof wellnessSnapshotsTable.$inferSelect;
