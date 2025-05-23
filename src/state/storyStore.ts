import { create } from 'zustand';

// Define the types for the story and the store
export interface Story { // Exporting for use in other parts of the app
  id: string;
  title: string;
  // artStyle: string; // Consider adding from factoryData
  // environment: string; // Consider adding from factoryData
  content: string; // Main story content
  history: string[]; // History of content changes
  // scenes: Scene[]; // Will be added in later sprints
  // createdAt: number; // From factoryData
  // updatedAt: number; // From factoryData
}

export interface StoryStore { // Exporting for use with the hook
  currentStory?: Story;
  setCurrentStory: (story: Story) => void;
  updateCurrentStoryContent: (content: string) => void;
  // Add more actions as needed, e.g., for managing scenes, history
}

// Create the Zustand store
export const useStoryStore = create<StoryStore>((set) => ({
  currentStory: undefined,
  setCurrentStory: (story) => set({ currentStory: story }),
  updateCurrentStoryContent: (content) =>
    set((state) => {
      if (state.currentStory) {
        return {
          currentStory: {
            ...state.currentStory,
            content: content,
            history: [...state.currentStory.history, state.currentStory.content], // Save previous content to history
          },
        };
      }
      return {}; // No change if there's no current story
    }),
}));

// Example of how to use it in a component:
// import { useStoryStore } from './storyStore';
// const currentStory = useStoryStore(state => state.currentStory);
// const setCurrentStory = useStoryStore(state => state.setCurrentStory);
// const updateCurrentStoryContent = useStoryStore(state => state.updateCurrentStoryContent);
