import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
// import App from './App.tsx' // Assuming App.tsx is not used or will be removed
import './index.css'; // If you have a global CSS file

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
        {/* Later, add routes for /editor/:id */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
