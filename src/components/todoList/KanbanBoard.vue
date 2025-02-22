<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Kanban Board'" 
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


  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageNavigation from './navigation/Navigation.vue'
import TaskFilters from './filters/TaskFilters.vue'

// State
const activeTab = ref('Kanban')
const executorOptions = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7']
const groupOptions = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
const priorityOptions = ['Critical', 'Urgent', 'Minor', 'Backlog']

// Filters
const selectedExecutor = ref(null) // need to add other page's setting
const selectedGroup = ref(null)
const selectedPriority = ref(null)

const updateExecutor = (executor) => {
  selectedExecutor.value = executor
}

const updateGroup = (group) => {
  selectedGroup.value = group
}

const updatePriority = (priority) => {
  selectedPriority.value = priority
}


</script>

<style scoped>
.filter-section {
  margin-bottom: 1rem;
  background-color: #e5e7eb; /* 背景色を灰色に設定 */
  padding: 1rem; /* パディングを追加 */
  border-radius: 0.5rem; /* 角を丸くする */
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.filter-label {
  width: 80px; /* ラベルの幅を固定 */
  text-align: right;
  padding-right: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-btn.active-tab {
  background-color: #111827;
  color: white;
}

.filter-btn:not(.active-tab) {
  background-color: white;
  color: #374151;
}

.filter-btn:not(.active-tab):hover {
  background-color: #F3F4F6;
}
</style>
