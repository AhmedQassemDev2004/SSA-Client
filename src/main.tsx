import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { suppressReactQuillWarnings } from './lib/utils'
import React from 'react';
import { HashRouter } from 'react-router-dom';

// Suppress ReactQuill warnings globally
suppressReactQuillWarnings();

createRoot(document.getElementById("root")!).render(<App />);
