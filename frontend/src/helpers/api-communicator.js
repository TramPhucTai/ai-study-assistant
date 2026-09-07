import axios from "axios";


// Fixed v1

export const loginUser = async (email, password) => {
  const res = await axios.post("/user/login", {
    email,
    password,
  });

  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");

  return res.data;
};

export const sendChatRequest = async (message) => {
  const res = await axios.post("/chat/new", {message});

  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");

  return res.data;
};



// Original

// export const loginUser = async (email, password) => {
//   const res = await axios.post('/user/login', {email, password });

//   if (res.status !== 200) {
//     throw new Error('Unable to login');
//   }

//   const data = res.data;

//   return data;
// }