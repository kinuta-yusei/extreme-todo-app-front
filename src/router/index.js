import { createRouter, createWebHistory } from 'vue-router'
import TableView from '@/components/todoList/tableView.vue'
import KanbanBoard from '@/components/todoList/KanbanBoard.vue'
import DiagramView from '@/components/todoList/DiagramView.vue'

const routes = [
  {
    path: '/table',
    name: 'Table',
    component: TableView
  },
  {
    path: '/kanban',
    name: 'Kanban',
    component: KanbanBoard
  },
  {
    path: '/diagram',
    name: 'Diagram',
    component: DiagramView
  },
  {
    path: '/',
    redirect: '/table'  // デフォルトのリダイレクト先
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 