import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: []
  }),
  
  actions: {
    async fetchTasks() {
      try {
        const response = await fetch('/api/tasks')
        this.tasks = await response.json()
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    
    async createTask(task) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
        const newTask = await response.json()
        this.tasks.push(newTask)
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
    
    async updateTask(task) {
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = task
        }
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    
    async deleteTask(taskId) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
        })
        this.tasks = this.tasks.filter(task => task.id !== taskId)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    },
    
    async updateTaskOrder(taskId, newIndex, oldIndex, columnId) {
      try {
        // タスクの新しい順序を反映
        const task = this.tasks.find(t => t.id === taskId)
        if (!task) return

        // タスクを古い位置から削除
        this.tasks = this.tasks.filter(t => t.id !== taskId)

        // タスクを新しい位置に挿入
        this.tasks.splice(newIndex, 0, task)

        // 同じカラム内でのタスクの順序を更新
        const columnTasks = this.tasks.filter(t => t.status === columnId)
        const updatedTasks = columnTasks.map((task, index) => ({
          ...task,
          order: index
        }))

        // バックエンドに新しい順序を送信
        await fetch(`/api/columns/${columnId}/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tasks: updatedTasks.map(t => ({ id: t.id, order: t.order })) })
        })

        // ローカルのタスク配列を更新
        this.tasks = this.tasks.map(task => {
          const updatedTask = updatedTasks.find(t => t.id === task.id)
          return updatedTask ? { ...task, order: updatedTask.order } : task
        })

      } catch (error) {
        console.error('Error updating task order:', error)
        // エラーが発生した場合、元の順序に戻す
        this.fetchTasks()
      }
    },
    
    async updateTaskStatus(taskId, newStatus) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.status = newStatus
        await this.updateTask(task)
      }
    }
  }
})