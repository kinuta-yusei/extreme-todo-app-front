<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Diagram'" 
      :active-tab="'Diagram'" 
      :tabs="['Table', 'Kanban', 'Diagram']"
      @update:active-tab="activeTab = $event"
    />

    <!-- Filters -->
    <div class="mb-8 space-y-4">
      <div v-for="(options, filter) in filters" :key="filter" class="flex items-center gap-4">
        <span class="w-24 text-gray-700">{{ filter }}:</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in options"
            :key="option.value"
            :class="[
              'px-4 py-1 rounded-full transition-all duration-200',
              option.selected ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
            @click="toggleFilter(filter, option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Task Button -->
    <button 
      @click="openCreateTaskModal"
      class="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <PlusIcon class="w-4 h-4 inline-block mr-2" />
      Create New Task
    </button>

    <!-- Kanban Board -->
    <div class="grid grid-cols-3 gap-6">
      <draggable
        v-for="column in columns" 
        :key="column.id"
        v-model="column.tasks"
        :group="{ name: 'tasks' }"
        item-key="id"
        class="bg-gray-200 rounded-lg p-4 min-h-[500px]"
        @change="handleDragChange"
      >
        <template #header>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <button 
                class="p-1 hover:bg-gray-300 rounded transition-colors"
                @click="openColumnSettings(column)"
              >
                <SettingsIcon class="w-4 h-4" />
              </button>
              <h3 class="font-medium">{{ column.title }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-gray-300 px-2 py-0.5 rounded-full text-sm">
                {{ getFilteredTasks(column.id).length }}
              </span>
              <button 
                class="p-1 hover:bg-gray-300 rounded transition-colors"
                @click="openColumnMenu(column)"
              >
                <MoreVerticalIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </template>

        <template #item="{ element: task }">
          <div
            class="bg-white p-4 rounded-lg shadow-sm mb-3 cursor-move hover:shadow-md transition-shadow"
            @dblclick="openEditTaskModal(task)"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium">{{ task.title }}</h4>
              <button 
                @click="deleteTask(task)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  class="rounded border-gray-300"
                  v-model="task.completed"
                  @change="updateTask(task)"
                >
                <span class="text-sm text-gray-600">{{ task.ticketNumber }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  :class="[
                    'w-2 h-2 rounded-full',
                    getPriorityColor(task.priority)
                  ]"
                ></span>
                <img 
                  :src="getUserAvatar(task.assignee)"
                  :alt="task.assignee"
                  class="w-6 h-6 rounded-full"
                />
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Task Modal -->
    <Modal v-if="showTaskModal" @close="closeTaskModal">
      <template #header>
        <h3 class="text-lg font-medium">
          {{ isEditing ? 'Edit Task' : 'Create New Task' }}
        </h3>
      </template>
      
      <template #default>
        <form @submit.prevent="handleTaskSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              v-model="taskForm.title" 
              type="text" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Ticket Number</label>
            <input 
              v-model="taskForm.ticketNumber" 
              type="text" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select 
              v-model="taskForm.priority"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="minor">Minor</option>
              <option value="backlog">Backlog</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Assignee</label>
            <select 
              v-model="taskForm.assignee"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Group</label>
            <select 
              v-model="taskForm.group"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
          </div>
        </form>
      </template>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <button 
            @click="closeTaskModal"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="handleTaskSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Column Settings Modal -->
    <Modal v-if="showColumnSettingsModal" @close="closeColumnSettingsModal">
      <template #header>
        <h3 class="text-lg font-medium">Column Settings</h3>
      </template>
      
      <template #default>
        <form @submit.prevent="handleColumnSettingsSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              v-model="columnSettingsForm.title" 
              type="text" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </form>
      </template>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <button 
            @click="closeColumnSettingsModal"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="handleColumnSettingsSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  SettingsIcon, 
  MoreVerticalIcon, 
  PlusIcon, 
  TrashIcon 
} from 'lucide-vue-next'
import draggable from 'vuedraggable'
import Modal from './KanbanModal.vue'
import PageNavigation from './navigation/Navigation.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { useGroupStore } from '@/stores/group'

// Stores
const taskStore = useTaskStore()
const userStore = useUserStore()
const groupStore = useGroupStore()

// State
const activeTab = ref('Kanban')
const showTaskModal = ref(false)
const showColumnSettingsModal = ref(false)
const isEditing = ref(false)
const selectedTask = ref(null)
const selectedColumn = ref(null)

const taskForm = ref({
  title: '',
  ticketNumber: '',
  priority: 'minor',
  assignee: '',
  group: '',
  status: 'todo'
})

const columnSettingsForm = ref({
  title: ''
})

// Fetch initial data
onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    userStore.fetchUsers(),
    groupStore.fetchGroups()
  ])
})

// Computed
const users = computed(() => userStore.users)
const groups = computed(() => groupStore.groups)
const tasks = computed(() => taskStore.tasks)

const getFilteredTasks = (status) => {
  return tasks.value.filter(task => task.status === status)
}

const columns = computed(() => [
  { id: 'todo', title: 'TO DO', tasks: getFilteredTasks('todo') },
  { id: 'inProgress', title: 'IN PROGRESS', tasks: getFilteredTasks('inProgress') },
  { id: 'inReview', title: 'IN REVIEW', tasks: getFilteredTasks('inReview') }
])

// Methods
const openCreateTaskModal = () => {
  isEditing.value = false
  taskForm.value = {
    title: '',
    ticketNumber: '',
    priority: 'minor',
    assignee: '',
    group: '',
    status: 'todo'
  }
  showTaskModal.value = true
}

const openEditTaskModal = (task) => {
  isEditing.value = true
  selectedTask.value = task
  taskForm.value = { ...task }
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const handleTaskSubmit = async () => {
  if (isEditing.value) {
    await taskStore.updateTask({
      ...selectedTask.value,
      ...taskForm.value
    })
  } else {
    await taskStore.createTask(taskForm.value)
  }
  closeTaskModal()
}

const deleteTask = async (task) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(task.id)
  }
}

const handleDragChange = async ({ moved, added }) => {
  if (moved) {
    const { element, newIndex, oldIndex } = moved
    await taskStore.updateTaskOrder(element.id, newIndex, oldIndex)
  }
  if (added) {
    const { element } = added
    await taskStore.updateTaskStatus(element.id, element.status)
  }
}

const openColumnSettings = (column) => {
  selectedColumn.value = column
  columnSettingsForm.value.title = column.title
  showColumnSettingsModal.value = true
}

const closeColumnSettingsModal = () => {
  showColumnSettingsModal.value = false
  selectedColumn.value = null
}

const handleColumnSettingsSubmit = async () => {
  if (selectedColumn.value) {
    await taskStore.updateColumn({
      ...selectedColumn.value,
      title: columnSettingsForm.value.title
    })
  }
  closeColumnSettingsModal()
}

const getUserAvatar = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user?.avatar || '/placeholder.svg?height=24&width=24'
}

// ... (previous filter-related code remains the same)
</script>

<style scoped>
.kanban-column {
  background: rgba(243, 244, 246, 0.9);
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 500px;
}

.task-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.priority-critical {
  background-color: #EF4444;
}

.priority-urgent {
  background-color: #F59E0B;
}

.priority-minor {
  background-color: #10B981;
}

.priority-backlog {
  background-color: #6B7280;
}

.filter-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-button.active {
  background-color: #111827;
  color: white;
}

.filter-button:not(.active) {
  background-color: white;
  color: #374151;
}

.filter-button:not(.active):hover {
  background-color: #F3F4F6;
}

/* Draggable styles */
.ghost {
  opacity: 0.5;
  background: #F3F4F6;
}

.drag-handle {
  cursor: move;
}

/* Animation transitions */
.task-enter-active,
.task-leave-active {
  transition: all 0.3s ease;
}

.task-enter-from,
.task-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Custom scrollbar */
.kanban-column {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.kanban-column::-webkit-scrollbar {
  width: 6px;
}

.kanban-column::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-column::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 3px;
}
</style>