import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getStory, saveStory } from '../state/db';
import { Story } from '../utils/types'; // Assuming Story type is defined in types.ts
import { generateStoryContinuation } from '../api/googleAI';
import { useStoryStore } from '../state/storyStore'; // For potential future use with history

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null | undefined>(undefined); // undefined: loading, null: not found
  const [loadingContinuation, setLoadingContinuation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store integration (primarily for setCurrentStory if needed, or history management)
  const setCurrentStoryInStore = useStoryStore(state => state.setCurrentStory);
  const updateStoryContentInStore = useStoryStore(state => state.updateCurrentStoryContent);


  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (updatedStory: Story) => {
      if (id) {
        // The subtask description for Editor.tsx uses saveStory(id, data)
        // but db.ts was refactored to use saveStory(story: Story).
        // I will adapt to the refactored db.ts which expects the full story object.
        await saveStory({ ...updatedStory, id, updatedAt: Date.now() });
        console.log("Story saved via debounce");
      }
    }, 1000), // Save 1 second after last change
    [id] 
  );

  useEffect(() => {
    if (!id) {
      setError("No story ID provided.");
      setStory(null); // Not found
      return;
    }
    getStory(id)
      .then(fetchedStory => {
        if (fetchedStory) {
          setStory(fetchedStory);
          setCurrentStoryInStore(fetchedStory); // Update Zustand store
        } else {
          setStory(null); // Not found
          setError(`Story with ID "${id}" not found.`);
        }
      })
      .catch(err => {
        console.error("Error fetching story:", err);
        setError("Failed to fetch story.");
        setStory(null); // Not found
      });
  }, [id, setCurrentStoryInStore]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (story) {
      const newContent = e.target.value;
      const updatedStory = { ...story, content: newContent };
      setStory(updatedStory);
      // setCurrentStoryInStore(updatedStory); // Update store immediately for responsive UI if needed elsewhere
      debouncedSave(updatedStory); // Debounce saving
    }
  };

  const handleContinueStory = async () => {
    if (!story || !story.content) {
      alert("Current story content is empty. Write something first or ensure story is loaded.");
      return;
    }
    setLoadingContinuation(true);
    setError(null);
    try {
      const continuation = await generateStoryContinuation(story.content);
      const newContent = story.content + '\n\n' + continuation; // Add two newlines
      
      // Update story state
      const updatedStoryData: Story = {
        ...story,
        content: newContent,
        history: [...(story.history || []), story.content], // Add current content to history
        updatedAt: Date.now(),
      };
      setStory(updatedStoryData);
      setCurrentStoryInStore(updatedStoryData); // Update Zustand store
      // The subtask description for Editor.tsx uses saveStory(id, data)
      // but db.ts was refactored to use saveStory(story: Story).
      // I will adapt to the refactored db.ts which expects the full story object.
      await saveStory({ ...updatedStoryData, id: id! }); // Save immediately after AI generation
      
    } catch (err) {
      console.error("Error generating story continuation:", err);
      setError("Failed to generate story continuation.");
    } finally {
      setLoadingContinuation(false);
    }
  };

  if (story === undefined) {
    return (
      <>
        <Navbar />
        <p>Loading story...</p>
      </>
    );
  }

  if (story === null) {
    return (
      <>
        <Navbar />
        <h1>Story Not Found</h1>
        <p>{error || `No story found with ID: ${id}`}</p>
        <button onClick={() => navigate('/')}>Go to Dashboard</button>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Editing: {story.title}</h1>
        <p>Style: {story.artStyle} | Environment: {story.environment}</p>
        <textarea
          value={story.content}
          onChange={handleContentChange}
          rows={20}
          style={{ width: '100%', minHeight: '300px', padding: '10px', boxSizing: 'border-box', whiteSpace: 'pre-wrap' }}
          placeholder="Start writing your story here..."
        />
        <div style={{ margin: '10px 0' }}>
          <button onClick={handleContinueStory} disabled={loadingContinuation || !story || !story.content}>
            {loadingContinuation ? '🤖 Generating Continuation...' : '✨ Continue Story (AI)'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div style={{ marginTop: '30px', padding: '15px', border: '1px dashed #ccc' }}>
          <h3>تقسيم القصة (Story Stages) - Placeholder</h3>
          <p>This section will later allow structuring the story into introduction, conflict, climax, resolution, etc.</p>
          <ul>
            <li>🏁 المقدمة (Introduction)</li>
            <li>🔥 الصراع (Conflict)</li>
            <li>🚀 الذروة (Climax)</li>
            <li>✅ النهاية (Resolution)</li>
          </ul>
        </div>
      </div>
    </>
  );
}

// Simple debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // It's important that the debounced function can be awaited if it's async.
    // The promise resolves with the result of the function call.
    return new Promise((resolve, reject) => { // Added reject for async functions
      timeoutId = setTimeout(async () => { // Make the inner function async
        try {
          const result = await func(...args); // Await the original function
          resolve(result);
        } catch (error) {
          reject(error); // Propagate errors
        }
      }, waitFor);
    });
  };
}
```
