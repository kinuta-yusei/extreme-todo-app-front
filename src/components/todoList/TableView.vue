<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="flex gap-6">
      <!-- Filter Panel -->
      <div class="w-72 bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold mb-3">Executor</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="user in users" 
              :key="user"
              :class="[
                'px-3 py-1 rounded-full text-sm',
                selectedUser === user ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedUser = user"
            >
              {{ user }}
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Todo Group</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="group in groups" 
              :key="group"
              :class="[
                'px-3 py-1 rounded-full text-sm',
                selectedGroup === group ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedGroup = group"
            >
              {{ group }}
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Priority</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="priority in priorities" 
              :key="priority"
              :class="[
                'px-3 py-1 rounded-full text-sm',
                selectedPriority === priority ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedPriority = priority"
            >
              {{ priority }}
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Status</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="status in statuses" 
              :key="status"
              :class="[
                'px-3 py-1 rounded-full text-sm',
                selectedStatus === status ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedStatus = status"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Scheduled Start Date</h2>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">From</span>
              <input 
                type="date" 
                v-model="startDate"
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">To</span>
              <input 
                type="date" 
                v-model="endDate"
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
            </div>
          </div>
        </div>
      </div>

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
import { ref } from 'vue'
import { SearchIcon, PlusIcon, ArrowsUpDownIcon } from 'lucide-vue-next'

const users = ref(['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'])
const groups = ref(['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7'])
const priorities = ref(['Critical', 'Urgent', 'Minor', 'Backlog'])
const statuses = ref(['TODO', 'IN PROGRESS', 'IN REVIEW'])
const tableHeaders = ref(['Todo Number', 'Todo name', 'Executor', 'Priority', 'Scheduled Start Date', 'Scheduled End Date'])

const selectedUser = ref('User1')
const selectedGroup = ref('Group1')
const selectedPriority = ref('Critical')
const selectedStatus = ref('TODO')
const startDate = ref('')
const endDate = ref('')

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
  }
])
</script>

<style>
/* スタイルが必要な場合はここに追加 */
</style>