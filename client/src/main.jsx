import { createRoot } from 'react-dom/client'
import './index.css'
import Router from "./routes/Route.jsx";

createRoot(document.getElementById('root')).render( 
  <Router />
);