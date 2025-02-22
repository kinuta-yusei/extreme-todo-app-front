<template>
  <nav class="navigation">
    <div class="menu-icon" @click="handleMenuClick">
      <MenuIcon class="w-6 h-6 text-gray-600" />
    </div>
    <h1 class="project-title">{{ projectName }}</h1>
    <div class="tab-container">
      <router-link
        v-for="tab in tabs"
        :key="tab"
        :to="{ name: tab }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          :class="[
            'tab-button',
            isActive ? 'active-tab' : 'inactive-tab'
          ]"
          @click="navigate"
        >
          {{ tab }}
        </button>
      </router-link>
    </div>
    <div class="right-space"></div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue'
import { MenuIcon } from 'lucide-vue-next'

defineProps({
  projectName: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})
</script>

<script>
export default {
  name: 'PageNavigation'
}
</script>

<style scoped>
.navigation {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  background-color: #f3f4f6;
  padding: 1rem;
}

.menu-icon {
  margin-right: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.menu-icon:hover {
  background-color: #e5e7eb;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  width: 25%;
  color: #374151;
}

.tab-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  width: 50%;
}

.right-space {
  width: 25%;
}

.tab-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.active-tab {
  background-color: #111827;
  color: white;
}

.inactive-tab {
  background-color: white;
  color: #374151;
  border: none;
}

.inactive-tab:hover {
  background-color: #f3f4f6;
}
</style>

