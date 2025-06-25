import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { suppressReactQuillWarnings } from './lib/utils'

// Suppress ReactQuill warnings globally
suppressReactQuillWarnings();

createRoot(document.getElementById("root")!).render(<App />);
