import './App.css';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import { useAuth } from "./context/useAuth.js";



function App() {
  const auth = useAuth();

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (
          <Route path="/chat" element={<Chat />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App