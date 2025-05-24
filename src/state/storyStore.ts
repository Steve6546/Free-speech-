import { create } from 'zustand';
import { Story } from '../utils/types'; // Import Story type from types.ts

// The Story interface is now imported from types.ts, so local definition is removed.

export interface StoryStore {
  currentStory?: Story; // Uses the imported Story type
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
        // Ensure history is initialized if it's undefined
        const history = state.currentStory.history || []; 
        return {
          currentStory: {
            ...state.currentStory,
            content: content,
            history: [...history, state.currentStory.content], // Save previous content to history
            updatedAt: Date.now(), // Update timestamp
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
