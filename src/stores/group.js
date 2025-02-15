import { defineStore } from 'pinia'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: []
  }),
  
  actions: {
    async fetchGroups() {
      try {
        const response = await fetch('/api/groups')
        this.groups = await response.json()
      } catch (error) {
        console.error('Error fetching groups:', error)
      }
    },
    
    async createGroup(group) {
      try {
        const response = await fetch('/api/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(group)
        })
        const newGroup = await response.json()
        this.groups.push(newGroup)
      } catch (error) {
        console.error('Error creating group:', error)
      }
    },
    
    async updateGroup(group) {
      try {
        await fetch(`/api/groups/${group.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(group)
        })
        const index = this.groups.findIndex(g => g.id === group.id)
        if (index !== -1) {
          this.groups[index] = group
        }
      } catch (error) {
        console.error('Error updating group:', error)
      }
    },
    
    async deleteGroup(groupId) {
      try {
        await fetch(`/api/groups/${groupId}`, {
          method: 'DELETE'
        })
        this.groups = this.groups.filter(group => group.id !== groupId)
      } catch (error) {
        console.error('Error deleting group:', error)
      }
    }
  },

  getters: {
    getGroupById: (state) => (id) => {
      return state.groups.find(group => group.id === id)
    }
  }
})