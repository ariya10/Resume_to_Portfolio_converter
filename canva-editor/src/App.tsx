import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CanvaEditor } from './components/canvas/CanvaEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{ duration: 2500 }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        <Route path="/editor" element={<CanvaEditor />} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/editor" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
