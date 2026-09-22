import { useEffect, useState } from "react";
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../helpers/api-communicator.js";
import { AuthContext } from "./AuthContext.js";



function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await checkAuthStatus();

        if (data) {
          setUser({
            email: data.email,
            name: data.name
          });

          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }

      } catch (error) {
        console.error(
          "Unable to check authentication status:",
          error
        );

        setUser(null);
        setIsLoggedIn(false);

      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

  }, []);


  const login = async (email, password) => {
    const data = await loginUser(
      email,
      password
    );

    if (data) {
      setUser({
        email: data.email,
        name: data.name
      });

      setIsLoggedIn(true);
    }
  };


  const signup = async (
    name,
    email,
    password
  ) => {
    const data = await signupUser(
      name,
      email,
      password
    );

    if (data) {
      setUser({
        email: data.email,
        name: data.name
      });

      setIsLoggedIn(true);
    }
  };


  const logout = async () => {
    await logoutUser();

    setUser(null);
    setIsLoggedIn(false);
  };


  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signup,
    logout
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;