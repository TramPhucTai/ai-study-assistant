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



// Original

// export const loginUser = async (email, password) => {
//   const res = await axios.post('/user/login', {email, password });

//   if (res.status !== 200) {
//     throw new Error('Unable to login');
//   }

//   const data = res.data;

//   return data;
// }