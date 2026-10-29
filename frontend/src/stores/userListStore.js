import { create } from 'zustand'
import userService from '../services/users'

const useUserListStore = create((set) => ({
  users: [],

  initializeUsers: async () => {
    const users = await userService.getAll()

    set({
      users,
    })
  },
}))

export default useUserListStore