import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'StoryFactoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'factories';

interface StoryFactoryDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: any; // Replace 'any' with a more specific type if available (e.g., StoryFactory)
  };
}

let dbPromise: Promise<IDBPDatabase<StoryFactoryDB>>;

function getDb(): Promise<IDBPDatabase<StoryFactoryDB>> {
  if (!dbPromise) {
    dbPromise = openDB<StoryFactoryDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveFactory(id: string, data: any): Promise<void> {
  const db = await getDb();
  // Ensure the data object has the 'id' property matching the keyPath
  const dataToStore = { ...data, id }; 
  await db.put(STORE_NAME, dataToStore);
}

export async function getAllFactories(): Promise<any[]> {
  const db = await getDb();
  return await db.getAll(STORE_NAME);
}

export async function getFactory(id: string): Promise<any | undefined> {
  const db = await getDb();
  return await db.get(STORE_NAME, id);
}

// Interface for factory data (optional, but good practice)
// You can define this in types.ts and import it here and in Setup.tsx/Dashboard.tsx
/*
export interface StoryFactory {
  id: string;
  title: string;
  artStyle: string;
  environment: string;
  createdAt: Date;
  // Add other relevant fields
}
*/
