import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllStories } from '../state/db'; // Renamed from getAllFactories
import { Story } from '../utils/types'; // Import Story type

export default function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]); // Renamed and typed with Story

  useEffect(() => {
    getAllStories().then(fetchedStories => { // Renamed from getAllFactories
      if (Array.isArray(fetchedStories)) {
        setStories(fetchedStories);
      } else {
        console.error("Fetched stories data is not an array:", fetchedStories);
        setStories([]);
      }
    }).catch(error => {
      console.error("Error fetching stories:", error);
      setStories([]);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Story Factory Dashboard</h1>
        <h2>Available Stories:</h2> {/* Updated heading */}
        {stories.length > 0 ? (
          <ul>
            {stories.map(story => ( // Iterate over stories
              <li key={story.id}>
                <Link to={`/editor/${story.id}`}>
                  {story.title || `Story ID: ${story.id}`} (Art: {story.artStyle}, Env: {story.environment})
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No stories found. Start a new story!</p>
        )}
        <Link to="/setup">
          <button>Start New Story</button>
        </Link>
      </div>
    </>
  );
}
