// import { useState, useEffect } from 'react'
// import { ChatInput } from './components/ChatInput'
// import ChatMessages from './components/ChatMessages'
import './App.css';
import Header from './components/Header'
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
  console.log(useAuth()?.isLoggedIn)

  return (
    <main>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )


  // Frontend communicate to backend tutorial

  // const [user, setUser] = useState([]);

  // const getUser = () => {
  //   fetch('/api/users')
  //     .then(res => res.json())
  //     .then(json => setUser(json))
  // }

  // useEffect(() => {
  //   getUser()
  // }, [])

  // return (
  //   <div>
  //     {user.map((data) => {
  //       return (
  //         <div style={{ border: '1px solid black', width: "500px" }}>
  //           <h1>Name: {data.name}</h1>
  //           <h1>Username: {data.username}</h1>
  //           <h1>Email:{data.email}</h1>
  //         </div>
  //       )
  //     })}
  //   </div>
  // )

  // React-Course

  // const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);

  // useEffect(() => {
  //   localStorage.setItem('messages', JSON.stringify(chatMessages))
  // }, [chatMessages])

  // return (
  //   <div className="app-container">
  //     <div className="welcome-text">
  //       {chatMessages.length === 0 && 'Welcome to the Chatbot project! Send a message using the textbox below'}
  //     </div>
  //     <ChatMessages
  //       chatMessages={chatMessages}
  //     />
  //     <ChatInput
  //       chatMessages={chatMessages}
  //       setChatMessages={setChatMessages}
  //     />
  //   </div>
  // );
}

export default App
