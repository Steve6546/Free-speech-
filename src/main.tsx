import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Editor from './pages/Editor'; // Import the Editor component
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/editor/:id" element={<Editor />} /> {/* Add route for Editor */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
