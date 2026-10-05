import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (message, seconds = 5) => {
    set({ notification: message })
    setTimeout(() => {
      set({ notification: null })
    }, seconds * 1000)
  },
}))

export const useNotificationValue = () =>
  useNotificationStore((state) => state.notification)

export const useSetNotification = () =>
  useNotificationStore((state) => state.setNotification)