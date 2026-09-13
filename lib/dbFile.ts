import fs from "fs";
import path from "path";
import type { CollectionName, DbRow, DbShape } from "./dbTypes";
import { emptyShape, seedStaff } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function readDbFile(): DbShape {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const seed = seedShape();
      writeDbFile(seed);
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    return { ...emptyShape(), ...parsed };
  } catch {
    const seed = seedShape();
    writeDbFile(seed);
    return seed;
  }
}

function writeDbFile(db: DbShape): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function seedShape(): DbShape {
  const seed = emptyShape();
  seed.staff = seedStaff();
  return seed;
}

function nextId(items: Array<{ id: number }>): number {
  return items.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}

export async function readTable<T extends DbRow>(collection: CollectionName): Promise<T[]> {
  return readDbFile()[collection] as unknown as T[];
}

export async function readDb(): Promise<DbShape> {
  return readDbFile();
}

export async function insert<T extends DbRow>(collection: CollectionName, item: Omit<T, "id">): Promise<T> {
  const db = readDbFile();
  const list = db[collection] as unknown as T[];
  const record = { ...item, id: nextId(list) } as T;
  (db[collection] as unknown as T[]).push(record);
  writeDbFile(db);
  return record;
}

export async function update<T extends DbRow>(
  collection: CollectionName,
  id: number,
  patch: Partial<T>
): Promise<T | null> {
  const db = readDbFile();
  const list = db[collection] as unknown as T[];
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...patch, id } as T;
  writeDbFile(db);
  return list[index];
}

export async function remove(collection: CollectionName, id: number): Promise<boolean> {
  const db = readDbFile();
  const list = db[collection] as unknown as Array<{ id: number }>;
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;
  (db[collection] as unknown as Array<{ id: number }>) = filtered;
  writeDbFile(db);
  return true;
}

export async function getSettings(): Promise<Record<string, unknown>> {
  return readDbFile().settings ?? {};
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = readDbFile();
  db.settings = { ...(db.settings ?? {}), [key]: value };
  writeDbFile(db);
}