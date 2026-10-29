import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,

  setUser: (user) =>
    set({
      user,
    }),

  logoutUser: () =>
    set({
      user: null,
    }),
}))

export default useUserStore