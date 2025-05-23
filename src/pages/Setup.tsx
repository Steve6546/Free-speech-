import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Uncommented
import { saveFactory } from '../state/db'; // Uncommented
import { generateStoryStub } from '../api/googleAI';
// import { StoryFactory } from '../utils/types'; // Consider using a type

export default function Setup() {
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
    const factoryId = Date.now().toString();
    // Consider defining a type for factoryData, e.g., StoryFactory
    const factoryData = { 
      id: factoryId, 
      title, 
      artStyle, 
      environment, 
      content: '', // Add initial content field for editor later
      scenes: [], // Add initial scenes for editor later
      createdAt: Date.now(), // Use Date.now() for timestamp
      updatedAt: Date.now() 
    };

    try {
      await saveFactory(factoryId, factoryData); // Uncommented and using await
      alert(`Factory "${title}" created and saved with ID: ${factoryId}`);
      setTitle('');
      setArtStyle('');
      setEnvironment('');
      setStoryStub('');
    } catch (error) {
      console.error('Error saving factory:', error);
      alert('Failed to save factory. See console for details.');
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
      <Navbar /> {/* Added Navbar */}
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
        <button onClick={handleCreate}>Create Story & Save</button>
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleFetchStub} disabled={loadingStub}>
            {loadingStub ? 'Generating Stub...' : 'Fetch Story Stub (AI)'}
          </button>
          {storyStub && (
            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Generated Story Stub:</h3>
              <p>{storyStub}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
