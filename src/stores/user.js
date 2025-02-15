import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: []
  }),
  
  actions: {
    async fetchUsers() {
      try {
        const response = await fetch('/api/users')
        this.users = await response.json()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    
    async createUser(user) {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        const newUser = await response.json()
        this.users.push(newUser)
      } catch (error) {
        console.error('Error creating user:', error)
      }
    },
    
    async updateUser(user) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        const index = this.users.findIndex(u => u.id === user.id)
        if (index !== -1) {
          this.users[index] = user
        }
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },
    
    async deleteUser(userId) {
      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  },

  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    }
  }
})