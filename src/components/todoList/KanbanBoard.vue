<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Kanban Board'" 
      :active-tab="'Table'" 
      :tabs="['Table', 'Kanban', 'Diagram']"
      @update:active-tab="activeTab = $event"
    />
  </div>
</template>

<script setup>
import PageNavigation from './navigation/Navigation.vue'

// State
const activeTab = ref('Kanban')

</script>

<style scoped>
</style>
