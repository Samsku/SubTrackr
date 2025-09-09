import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getUser } from './auth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = localStorage.getItem('notifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((message) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [...prevNotifications, { id, message }]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, notifications, addNotification, clearNotifications }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);