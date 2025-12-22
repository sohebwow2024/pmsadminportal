import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../../API/axios' 

const NotificationContext = createContext()

export const NotificationProvider = ({ children, loginID, token }) => {
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/Reports/BookedNotificationDetails`, {
        headers: {
          LoginID: loginID,
          Token: token,
          Seckey: "123",
          Event: 'BookedNotificationDetails'
        }
      })
      setNotifications(res.data[0] || [])
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  const removeNotification = (transactionId) => {
    setNotifications(prev => prev.filter(n => n.TransactionID !== transactionId))
  }

const markAllAsRead = () => {
  setNotifications([])
}

  useEffect(() => {
    if (loginID && token) {
      fetchNotifications()
    }
  }, [loginID, token])

  return (
    <NotificationContext.Provider value={{
      notifications,
      fetchNotifications,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
