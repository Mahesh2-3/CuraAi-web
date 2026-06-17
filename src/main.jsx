/**
 * main.jsx
 * 
 * Main JavaScript entry point for the React application.
 * Imports global CSS styles, mounts the root App component inside React's StrictMode,
 * and attaches it to the DOM container with ID 'root'.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
