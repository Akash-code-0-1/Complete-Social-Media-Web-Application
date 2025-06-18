// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const  AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const login = async (inputs) => {
//     const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
//       withCredentials: true,
//     });

//     setCurrentUser(res.data)
//   };

//   const updateUser = (updatedUserData) => {
//     setCurrentUser(updatedUserData);  // Update the current user with new data
//     localStorage.setItem("user", JSON.stringify(updatedUserData));  // Save the updated user data to localStorage
//   };

//   useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(currentUser));
//   }, [currentUser]);


  

  

//   return (
//     <AuthContext.Provider value={{ currentUser, login}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
  };

  const updateUser = (updatedUserData) => {
    setCurrentUser(updatedUserData);  // Update the current user with new data
    localStorage.setItem("user", JSON.stringify(updatedUserData));  // Save the updated user data to localStorage
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

