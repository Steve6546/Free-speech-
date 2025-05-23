import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Uncommented
import { getAllFactories } from '../state/db'; // Uncommented
// Assuming a type for factory for better type safety, can be defined in types.ts
// import { StoryFactory } from '../utils/types'; 

interface FactoryDisplayItem { // Or import StoryFactory if defined elsewhere
  id: string;
  title?: string; // Make title optional if it might not exist
}

export default function Dashboard() {
  const [factories, setFactories] = useState<FactoryDisplayItem[]>([]); // Use a more specific type

  useEffect(() => {
    getAllFactories().then(fetchedFactories => {
      // Ensure fetchedFactories is an array and map correctly
      if (Array.isArray(fetchedFactories)) {
        setFactories(fetchedFactories.map(f => ({ id: f.id, title: f.title || `Factory ${f.id}` })));
      } else {
        setFactories([]); // Set to empty array if data is not as expected
      }
    }).catch(error => {
      console.error("Error fetching factories:", error);
      setFactories([]); // Set to empty array on error
    });
  }, []);

  return (
    <>
      <Navbar /> {/* Added Navbar */}
      <div>
        <h1>Story Factory Dashboard</h1>
        <h2>Available Factories:</h2>
        {factories.length > 0 ? (
          <ul>
            {factories.map(factory => (
              <li key={factory.id}>{factory.title || factory.id}</li> // Display title or ID
            ))}
          </ul>
        ) : (
          <p>No factories found. Start a new story!</p>
        )}
        <Link to="/setup">
          <button>Start New Story</button>
        </Link>
      </div>
    </>
  );
}
