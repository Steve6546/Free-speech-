export interface Scene {
  id: string; // Unique ID for the scene, can be timestamp or UUID
  text: string; // Text content of the scene
  image?: string; // URL or base64 of the generated image (for Sprint 3)
  // Add other scene-specific properties if needed in future sprints
}

export interface Story {
  id: string; // Unique ID for the story (e.g., timestamp)
  title: string;
  artStyle: string;
  environment: string;
  content: string; // Main story content from the editor
  history: string[]; // History of main content changes
  scenes: Scene[]; // Array of scenes for Sprint 3
  createdAt: number; // Timestamp of creation
  updatedAt: number; // Timestamp of last update
  season?: string; // For Sprint 4
  episode?: number; // For Sprint 4
}
