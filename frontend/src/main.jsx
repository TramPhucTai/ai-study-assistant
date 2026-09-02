import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';



axios.defaults.baseURL = "http://localhost:5000/api/v1";

// Allow setting the cookies directly from the backend
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, Arial",
    allVariants: {
      color: "white"
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-right"/>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
