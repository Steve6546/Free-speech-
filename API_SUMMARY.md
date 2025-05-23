# StoryFactory AI - Internal API Summary

This document provides a summary of the local database, Google AI integration, page routing, and state management for the StoryFactory AI application.

## Local Database (IndexedDB via `idb`)

Accessed via functions in `/src/state/db.ts`.

*   **`saveFactory(id: string, data: any)`**: Saves or updates a factory (story setup) in the `factories` object store. The `data` object should include an `id` property matching the `id` parameter.
    *   Example `data` structure: `{ id: '...', title: '...', artStyle: '...', environment: '...', content: '...', scenes: [], createdAt: ..., updatedAt: ... }`
*   **`getAllFactories(): Promise<any[]>`**: Retrieves all factory objects from the `factories` store.
*   **`getFactory(id: string): Promise<any | undefined>`**: Retrieves a specific factory by its ID. Returns `undefined` if not found.

Database Name: `StoryFactoryDB`
Object Store: `factories` (keyPath: `id`)

## Google AI

Accessed via functions in `/src/api/googleAI.ts`.

*   **Endpoint**: `https://api.generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText`
    *   (Note: Sprint 3 specifies `v1beta` and `image-bison-001` for image generation - this will be a separate function)
*   **Function**: `generateStoryStub(setup: { title: string; style: string; setting: string; }): Promise<string>`
    *   Takes story title, art style, and setting.
    *   Returns a generated story stub (summary) as a string.
*   **API Key**: Currently hardcoded as `<KEY>` in `googleAI.ts`. **NEEDS REPLACEMENT** with a valid Google AI API key. Store securely, e.g., via environment variables in a real deployment.

*   **(Sprint 2 - Future)** `generateStoryContinuation(content: string): Promise<string>`
    *   Takes existing story content.
    *   Returns a continuation of the story.

*   **(Sprint 3 - Future)** `generateSceneImage(scene: string, styleKey: string): Promise<string>`
    *   Takes a scene description and style key.
    *   Returns a URL or base64 string of the generated image. (Uses `image-bison-001` model)


## Pages & Routing (`react-router-dom`)

Configured in `/src/main.tsx`.

*   `/`: Renders `Dashboard.tsx` (Dashboard page)
    *   Displays existing stories/factories.
    *   Link to create a new story.
*   `/setup`: Renders `Setup.tsx` (Setup page)
    *   Form to input story title, art style, environment.
    *   Button to create and save the story setup.
    *   Button to fetch an initial story stub from Google AI.
*   `/editor/:id`: (Sprint 2 - Future) Renders `Editor.tsx` for editing a specific story.
*   `/scenes?id=:id`: (Sprint 3 - Future) Renders `ScenesPreview.tsx` to show generated scenes for a story.
*   `/story/:id`: (Sprint 4 - Future) Renders `StoryView.tsx` to display a story with its timeline.


## State Management (Zustand)

Configured in `/src/state/storyStore.ts`.

*   **`useStoryStore`**: Zustand hook to access the store.
    *   `currentStory?: Story`: Holds the story object currently being edited or viewed.
        *   `Story` interface (from `/src/state/storyStore.ts`): `{ id, title, content, history, ... }` (other fields like `artStyle`, `environment`, `scenes`, `createdAt`, `updatedAt` can be part of this object).
    *   `setCurrentStory(story: Story)`: Action to set the `currentStory`.
    *   `updateCurrentStoryContent(content: string)`: Action to update the content of the `currentStory` and record the previous content in its `history`.

## Project Scripts (`package.json`)

*   `npm run dev`: Starts the Vite development server (usually on `http://localhost:5173`).

## Main Types (`/src/utils/types.ts`)

This file is intended for shared TypeScript interfaces/types. While some types are defined locally in components or stores, common types should be centralized here.

Example (to be added/consolidated):
\`\`\`typescript
// // From storyStore.ts (can be moved here and imported)
// export interface Story {
//   id: string;
//   title: string;
//   artStyle: string;
//   environment: string;
//   content: string; // Initial stub or combined text from editor
//   history: string[]; // History of content changes for the main content
//   // scenes: Scene[]; // Defined below, will be part of Story
//   createdAt: number;
//   updatedAt: number;
//   season?: string;
//   episode?: number;
// }

// // For Sprint 3/4 (can be defined here)
// export interface Scene {
//   id: string; // Unique ID for the scene
//   text: string; // Text content of the scene
//   image?: string; // URL or base64 of the generated image
//   timestamp: number; // When the scene was created/generated
//   // Add other scene-specific properties if needed
// }

// // Update Story to include scenes array
// export interface Story {
//   // ... other properties from above
//   scenes: Scene[];
// }
\`\`\`
This provides a comprehensive overview for developers.
