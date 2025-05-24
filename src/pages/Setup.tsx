import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';
import { saveStory } from '../state/db';
import { generateStoryStub } from '../api/googleAI'; // StorySetup from googleAI.ts is not directly used here.
import { Story } from '../utils/types'; // Import Story type

export default function Setup() {
  const navigate = useNavigate(); // Initialize navigate
  const [title, setTitle] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [environment, setEnvironment] = useState('');
  const [storyStub, setStoryStub] = useState('');
  const [loadingStub, setLoadingStub] = useState(false);

  const handleCreate = async () => {
    if (!title || !artStyle || !environment) {
      alert('Please fill in all fields.');
      return;
    }
    const now = Date.now();
    const storyId = now.toString(); 
    const newStoryData: Story = { 
      id: storyId,
      title,
      artStyle,
      environment,
      content: '', // Initialize content as empty. Stub is for preview.
      history: [], 
      scenes: [],
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Using saveStory(story: Story) as per db.ts refactoring
      await saveStory(newStoryData); 
      alert(`Story "${title}" created and saved with ID: ${storyId}`);
      // Clear form fields
      setTitle('');
      setArtStyle('');
      setEnvironment('');
      setStoryStub('');
      navigate(`/editor/${storyId}`); // Navigate to editor
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. See console for details.');
    }
  };

  const handleFetchStub = async () => {
    if (!title || !artStyle || !environment) {
      alert('Please fill in title, art style, and environment to generate a stub.');
      return;
    }
    setLoadingStub(true);
    setStoryStub('');
    try {
      const stub = await generateStoryStub({ title, style: artStyle, setting: environment });
      setStoryStub(stub);
    } catch (error) {
      console.error('Error fetching story stub:', error);
      setStoryStub('Failed to fetch story stub. See console for details.');
    } finally {
      setLoadingStub(false);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Setup New Story</h1>
        <div>
          <label htmlFor="title">Story Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="artStyle">Art Style:</label>
          <select id="artStyle" value={artStyle} onChange={(e) => setArtStyle(e.target.value)}>
            <option value="">Select Art Style</option>
            <option value="anime">Anime</option>
            <option value="cartoon">Cartoon</option>
            <option value="noir">Noir</option>
            <option value="fantasy">Fantasy</option>
          </select>
        </div>
        <div>
          <label htmlFor="environment">Environment:</label>
          <select id="environment" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
            <option value="">Select Environment</option>
            <option value="city">City</option>
            <option value="forest">Forest</option>
            <option value="space">Space Station</option>
            <option value="medieval">Medieval Kingdom</option>
          </select>
        </div>
        
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <button 
            onClick={handleFetchStub} 
            disabled={loadingStub || !title || !artStyle || !environment}
          >
            {loadingStub ? 'Generating Stub...' : 'Fetch Story Stub (AI Preview)'}
          </button>
          {storyStub && (
            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Generated Story Stub Preview:</h3>
              <p>{storyStub}</p>
              <p><small>(This stub is for preview only. The story will start empty in the editor.)</small></p>
            </div>
          )}
        </div>

        <button 
          onClick={handleCreate} 
          disabled={!title || !artStyle || !environment}
        >
          Create Story & Go to Editor
        </button>
      </div>
    </>
  );
}
