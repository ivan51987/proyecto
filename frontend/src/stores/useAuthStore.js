import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: {
      id: null,
      username: null,
      role: null,
      permissions: []
    }
  }),
  actions: {
    setUserData(token, user) {
      this.token = token
      this.user = { ...user }
    },
    logout() {
      this.token = null
      this.user = {
        id: null,
        username: null,
        role: null,
        permissions: []
      }
      localStorage.removeItem('token')
    }
  }
})
