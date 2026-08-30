import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../helpers/api-communicator.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch if the user's cookies are valid then skip login
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    if (data) {
      setUser({email: data.email, name: data.name });
      setIsLoggedIn(true);
    }
  };

  const signup = async (name, email, password) => {
    // Signup logic will go here
  };

  const logout = async () => {
    // Logout logic will go here
  };

  const value = {
    user,
    isLoggedIn,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);