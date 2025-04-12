import { useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './configs/router';
import ContextProvider from './provider/Context';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ContextProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </ContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
