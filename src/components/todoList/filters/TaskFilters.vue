<template>
  <div class="filter-section bg-gray-200 p-4 rounded-lg">
    <!-- Executor Filter -->
    <div class="filter-row">
      <div class="filter-label">Executor:</div>
      <div class="filter-buttons">
        <button
          v-for="executor in properties.executorOptions"
          :key="executor"
          @click="handleExecutorClick(executor)"
          :class="['filter-btn', { 'active-tab': selectedExecutor === executor }]"
        >
          {{ executor }}
        </button>
      </div>
    </div>

    <!-- Group Filter -->
    <div class="filter-row">
      <div class="filter-label">Group:</div>
      <div class="filter-buttons">
        <button
          v-for="group in properties.groupOptions"
          :key="group"
          @click="handleGroupClick(group)"
          :class="['filter-btn', { 'active-tab': selectedGroup === group }]"
        >
          {{ group }}
        </button>
      </div>
    </div>

    <!-- Priority Filter -->
    <div class="filter-row">
      <div class="filter-label">Priority:</div>
      <div class="filter-buttons">
        <button
          v-for="priority in properties.priorityOptions"
          :key="priority"
          @click="handlePriorityClick(priority)"
          :class="['filter-btn', { 'active-tab': selectedPriority === priority }]"
        >
          {{ priority }}
        </button>
      </div>
    </div>

    <!-- Status Filter -->
    <div v-if="properties.isStatusNeeded" class="filter-row">
      <div class="filter-label">Status:</div>
      <div class="filter-buttons">
        <button
          v-for="status in properties.statusOptions"
          :key="status"
          @click="handleStatusClick(status)"
          :class="['filter-btn', { 'active-tab': selectedStatus === status }]"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Schedule Filter -->
    <div v-if="properties.isScheduleNeeded" class="filter-row">
      <div class="filter-label">Schedule:</div>
        <div class="filter-calendar">
            <div class="date-input-wrapper">
                <span class="date-placeholder">Target Start Date</span>
                <input type="date" class="filter-btn" v-model="selectedStartDate">
            </div>
            <div class="date-input-wrapper">
                <span class="date-placeholder">Target End Date</span>
                <input type="date" class="filter-btn" v-model="selectedEndDate">
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const properties = defineProps({
  executorOptions: Array,
  defaultExecutor: String,
  groupOptions: Array,
  defaultGroup: String,
  priorityOptions: Array,
  defaultPriority: String,
  isStatusNeeded: Boolean,
  statusOptions: Array,
  isScheduleNeeded: Boolean
})

const emits = defineEmits(['updateExecutor', 'updateGroup', 'updatePriority', 'updateStatus'])

// Filters
const selectedExecutor = ref()
const selectedGroup = ref()
const selectedPriority = ref()
const selectedStatus = ref()

// Schedule
const selectedStartDate = ref('')
const selectedEndDate = ref('')

const handleExecutorClick = (executor) => {
  selectedExecutor.value = selectedExecutor.value === executor ? undefined : executor
  emits('updateExecutor', selectedExecutor.value)
}

const handleGroupClick = (group) => {
  selectedGroup.value = selectedGroup.value === group ? undefined : group
  emits('updateGroup', selectedGroup.value)
}

const handlePriorityClick = (priority) => {
  selectedPriority.value = selectedPriority.value === priority ? undefined : priority
  emits('updatePriority', selectedPriority.value)
}

const handleStatusClick = (status) => {
  selectedStatus.value = selectedStatus.value === status ? undefined : status
  emits('updateStatus', selectedStatus.value)
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 1rem;
  background-color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.filter-label {
  width: 80px;
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

.filter-calendar {
  display: flex;
  gap: 0.5rem;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-placeholder {
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 150px; /* 幅を調整 */
}

</style>
