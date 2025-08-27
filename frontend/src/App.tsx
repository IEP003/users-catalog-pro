import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<UsersPage />} />
        <Route path="*" element={<div>App</div>} />
      </Routes>
    </div>
  )
}


export default App;