import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router';
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';



axios.defaults.baseURL = "https://ai-study-assistant-backend-gvg5.onrender.com/api/v1";

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
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Toaster position="top-right" />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
)
