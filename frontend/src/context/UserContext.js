import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Create a context for the user
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateFlightModalOpen, setIsCreateFlightModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [editData, setEditData] = useState([])
  const [isEditLogOpen, setIsEditLogOpen] = useState(false)
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [isAdminControlOpen, setIsAdminControlOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userData, setUserData] = useState([])

  // Function to store the token
  const storeToken = (userToken) => {
    setToken(userToken);
    localStorage.setItem('userToken', userToken);
  };

  // Function to remove the token (e.g., on logout)
  const removeToken = () => {
    setToken(null);
    localStorage.removeItem('userToken');
  };

  return (
    <UserContext.Provider value={{ token, storeToken, removeToken, isLoginModalOpen, setIsLoginModalOpen, isCreateFlightModalOpen, setIsCreateFlightModalOpen,
      tableData, setTableData, isEditLogOpen, setIsEditLogOpen, editData, setEditData, isCreateAccountOpen, setIsCreateAccountOpen, searchText, setSearchText,
      isAdminControlOpen, setIsAdminControlOpen, isAdmin, setIsAdmin, userData, setUserData}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };