import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'  // Add this import
import {HashRouter} from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>  
      <App />      
    </AuthProvider>
  </StrictMode>,
)