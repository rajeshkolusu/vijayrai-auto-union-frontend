import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from "axios";

// This redirects ALL your frontend API calls globally to your live cloud server!
axios.defaults.baseURL = "https://d5816076-422e-4156-8125-98bade78084f-dev.e1-us-east-azure.choreoapis.dev/default/vijayrai-auto-union-backe/v1.0/api";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
