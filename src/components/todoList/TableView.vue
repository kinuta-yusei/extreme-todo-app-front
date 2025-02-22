<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Table'" 
      :active-tab="'Table'" 
      :tabs="['Table', 'Kanban', 'Diagram']"
      @update:active-tab="activeTab = $event"
    />

    <!-- Filters -->
    <TaskFilters
      :executor-options="executorOptions" 
      :default-executor="selectedExecutor" 
      :group-options="groupOptions" 
      :default-group="selectedGroup" 
      :priority-options="priorityOptions" 
      :default-priority="selectedPriority"
      :isStatusNeeded="true"
      :status-options="['todo', 'inProgress', 'inReview']"
      :default-status="todo"
      :isScheduleNeeded="true"
      @updateExecutor="updateExecutor" 
      @updateGroup="updateGroup" 
      @updatePriority="updatePriority" 
    />

    <div class="flex gap-6">
      <!-- Table View -->
      <div class="flex-1 bg-white rounded-lg shadow">
        <div class="p-4 flex justify-between items-center border-b">
          <div class="flex gap-2">
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <SearchIcon class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <button class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
            <PlusIcon class="w-5 h-5" />
            Create
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  <div class="flex items-center gap-2">
                    {{ header }}
                    <ArrowsUpDownIcon class="w-4 h-4 text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="todo in todos" :key="todo.id" class="border-t hover:bg-gray-50">
                <td class="px-6 py-4 text-sm">{{ todo.number }}</td>
                <td class="px-6 py-4 text-sm">{{ todo.name }}</td>
                <td class="px-6 py-4 text-sm">{{ todo.executor }}</td>
                <td class="px-6 py-4 text-sm">{{ todo.priority }}</td>
                <td class="px-6 py-4 text-sm">{{ todo.startDate }}</td>
                <td class="px-6 py-4 text-sm">{{ todo.endDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageNavigation from './navigation/Navigation.vue'
import { ref } from 'vue'
import { SearchIcon, PlusIcon, ArrowsUpDownIcon } from 'lucide-vue-next'
import TaskFilters from './filters/TaskFilters.vue'

const tableHeaders = ref(['Todo Number', 'Todo name', 'Executor', 'Priority', 'Scheduled Start Date', 'Scheduled End Date'])

const executorOptions = ref(['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'])
const groupOptions = ref(['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7'])
const priorityOptions = ref(['Critical', 'Urgent', 'Minor', 'Backlog'])
const selectedExecutor = ref('User1')
const selectedGroup = ref('Group1')
const selectedPriority = ref('Critical')

// TODO ダミーデータで作成しているので、APIから取得するようにする
const todos = ref([
  {
    id: 1,
    number: 1,
    name: 'Create Design Document',
    executor: 'AGU-123',
    priority: 'Critical',
    startDate: '',
    endDate: ''
  },
  {
    id: 2,
    number: 2,
    name: 'Create API Document',
    executor: 'AGU-123',
    priority: 'Critical',
    startDate: '',
    endDate: ''
  },
  {
    id: 3,
    number: 3,
    name: 'Create API Document',
    executor: 'AGU-123',
    priority: 'Critical',
    startDate: '',
    endDate: ''
  }
])
</script>

<style scoped>
.table-container {
  width: 800px; /* テーブルの幅を調整 */
  margin: 20px auto; /* テーブルを中央に配置 */
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.search-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-right: 5px;
}

.search-button,
.close-button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* 偶数行の背景色を変更 */
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>