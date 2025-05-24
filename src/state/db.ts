import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Story } from '../utils/types'; // Import Story type

const DB_NAME = 'StoryFactoryDB';
const DB_VERSION = 1; // Keep version 1, or increment if schema changes significantly
const STORE_NAME = 'stories'; // Updated constant

interface StoryFactoryDB extends DBSchema {
  [STORE_NAME]: { // Changed from 'factories'
    key: string;
    value: Story; // Use Story type
  };
}

let dbPromise: Promise<IDBPDatabase<StoryFactoryDB>>;

function getDb(): Promise<IDBPDatabase<StoryFactoryDB>> {
  if (!dbPromise) {
    dbPromise = openDB<StoryFactoryDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          console.log(`Object store "${STORE_NAME}" created.`);
        }
        // Example for handling data migration if the store name changed:
        // if (oldVersion > 0 && oldVersion < NEW_VERSION_WHERE_STORE_NAME_CHANGED) {
        //   if (db.objectStoreNames.contains('factories') && !db.objectStoreNames.contains(STORE_NAME)) {
        //     const oldStore = transaction.objectStore('factories');
        //     const newStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        //     let cursor = await oldStore.openCursor();
        //     while (cursor) {
        //       // Potentially transform cursor.value to match Story type
        //       newStore.add(cursor.value); 
        //       cursor = await cursor.continue();
        //     }
        //     db.deleteObjectStore('factories');
        //     console.log('Migrated data from "factories" to "stories" store.');
        //   }
        // }
      },
    });
  }
  return dbPromise;
}

export async function saveStory(story: Story): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, story);
}

export async function getAllStories(): Promise<Story[]> {
  const db = await getDb();
  return await db.getAll(STORE_NAME);
}

export async function getStory(id: string): Promise<Story | undefined> {
  const db = await getDb();
  return await db.get(STORE_NAME, id);
}
