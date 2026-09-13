import type { CollectionName, DbRow } from "./dbTypes";
import * as file from "./dbFile";
import * as pg from "./dbPostgres";

export * from "./dbTypes";
export { hashPassword, verifyPassword } from "./passwords";

export const dbBackend: "postgres" | "file" = process.env.DATABASE_URL ? "postgres" : "file";

function pick(): typeof file {
  return dbBackend === "postgres" ? pg : file;
}

export async function readTable<T extends DbRow>(collection: CollectionName): Promise<T[]> {
  return pick().readTable<T>(collection);
}

export async function readDb(): Promise<import("./dbTypes").DbShape> {
  return pick().readDb();
}

export async function insert<T extends DbRow>(collection: CollectionName, item: Omit<T, "id">): Promise<T> {
  return pick().insert<T>(collection, item);
}

export async function update<T extends DbRow>(
  collection: CollectionName,
  id: number,
  patch: Partial<T>
): Promise<T | null> {
  return pick().update<T>(collection, id, patch);
}

export async function remove(collection: CollectionName, id: number): Promise<boolean> {
  return pick().remove(collection, id);
}

export async function getSettings(): Promise<Record<string, unknown>> {
  return pick().getSettings();
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  return pick().setSetting(key, value);
}