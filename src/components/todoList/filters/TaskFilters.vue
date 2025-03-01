<template>
  <div class="filter-section bg-gray-200 p-4 rounded-lg">
    <!-- Executor Filter -->
    <div class="filter-row">
      <div class="filter-label">Executor:</div>
      <div class="filter-buttons">
        <template v-if="selectedExecutor.length === 0">
          <!-- SVGを表示 -->
          <svg
            class="add-filter-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            @click="showSearchPopup('executor')"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- active-tabの要素を表示 -->
          <button
            v-for="executor in executorOptions"
            :key="executor"
            @click="handleExecutorClick(executor)"
            :class="[
              'filter-btn',
              { 'active-tab': selectedExecutor.includes(executor) },
            ]"
          >
            {{ executor }}
          </button>
        </template>
      </div>
    </div>

    <!-- Group Filter -->
    <div class="filter-row">
      <div class="filter-label">Group:</div>
      <div class="filter-buttons">
        <template v-if="selectedGroup.length === 0">
          <!-- SVGを表示 -->
          <svg
            class="add-filter-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            @click="showSearchPopup('group')"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- active-tabの要素を表示 -->
          <button
            v-for="group in groupOptions"
            :key="group"
            @click="handleGroupClick(group)"
            :class="[
              'filter-btn',
              { 'active-tab': selectedGroup.includes(group) },
            ]"
          >
            {{ group }}
          </button>
        </template>
      </div>
    </div>

    <!-- Priority Filter -->
    <div class="filter-row">
      <div class="filter-label">Priority:</div>
      <div class="filter-buttons">
        <template v-if="selectedPriority.length === 0">
          <!-- SVGを表示 -->
          <svg
            class="add-filter-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            @click="showSearchPopup('priority')"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- active-tabの要素を表示 -->
          <button
            v-for="priority in priorityOptions"
            :key="priority"
            @click="handlePriorityClick(priority)"
            :class="[
              'filter-btn',
              { 'active-tab': selectedPriority.includes(priority) },
            ]"
          >
            {{ priority }}
          </button>
        </template>
      </div>
    </div>

    <!-- Status Filter -->
    <div v-if="properties.isStatusNeeded" class="filter-row">
      <div class="filter-label">Status:</div>
      <div class="filter-buttons">
        <template v-if="selectedStatus.length === 0">
          <!-- SVGを表示 -->
          <svg
            class="add-filter-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            @click="showSearchPopup('status')"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- active-tabの要素を表示 -->
          <button
            v-for="status in statusOptions"
            :key="status"
            @click="handleStatusClick(status)"
            :class="[
              'filter-btn',
              { 'active-tab': selectedStatus.includes(status) },
            ]"
          >
            {{ status }}
          </button>
        </template>
      </div>
    </div>

    <!-- Schedule Filter -->
    <div v-if="properties.isScheduleNeeded" class="filter-row">
      <div class="filter-label">Schedule:</div>
      <div class="filter-calendar">
        <div class="date-input-wrapper">
          <span class="date-placeholder">Target Start Date</span>
          <input
            type="date"
            class="filter-btn"
            v-model="selectedStartDate"
            @change="validateDates"
          />
        </div>
        <div class="date-input-wrapper">
          <span class="date-placeholder">Target End Date</span>
          <input
            type="date"
            class="filter-btn"
            v-model="selectedEndDate"
            @change="validateDates"
          />
        </div>
      </div>
    </div>
    <div v-if="dateError" class="error-message">{{ dateError }}</div>
  </div>

  <!-- Search Popup -->
  <div
    v-if="isShowSearchPopup"
    class="search-popup-overlay"
    @click.self="closeSearchPopup"
  >
    <div class="search-popup">
      <div class="search-popup-content">
        <input
          type="text"
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
          placeholder="Enter keyword"
          ref="searchInput"
        />
        <div class="search-results">
          <div
            v-for="item in filteredOptions"
            :key="item"
            class="search-result-item"
          >
            {{ item }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="close-icon"
              viewBox="0 -960 960 960"
              fill="#e8eaed"
              @click="removeOption(item)"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </div>
        </div>
        <div class="search-popup-footer">
          <button @click="handleSearch">Search</button>
          <button @click="closeSearchPopup">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  nextTick,
  onMounted,
  computed,
} from "vue";

const properties = defineProps({
  executorOptions: Array,
  defaultExecutor: String,
  groupOptions: Array,
  defaultGroup: String,
  priorityOptions: Array,
  defaultPriority: String,
  isStatusNeeded: Boolean,
  statusOptions: Array,
  isScheduleNeeded: Boolean,
});

const emits = defineEmits([
  "updateExecutor",
  "updateGroup",
  "updatePriority",
  "updateStatus",
  "updateExecutorOption",
]);

// Filters
const selectedExecutor = ref([]);
const selectedGroup = ref([]);
const selectedPriority = ref([]);
const selectedStatus = ref([]);

// Schedule
const selectedStartDate = ref("");
const selectedEndDate = ref("");
const dateError = ref("");

// Search
const isShowSearchPopup = ref(false);
const searchKeyword = ref("");
const searchInput = ref("");
const currentFilterType = ref(""); // 現在のフィルタータイプ

const executorOptions = ref([...properties.executorOptions]);
const groupOptions = ref([...properties.groupOptions]);
const priorityOptions = ref([...properties.priorityOptions]);
const statusOptions = ref([]);

watch(properties.executorOptions, (newOptions) => {
  executorOptions.value = [...newOptions];
});

watch(properties.groupOptions, (newOptions) => {
  groupOptions.value = [...newOptions];
});

watch(properties.priorityOptions, (newOptions) => {
  priorityOptions.value = [...newOptions];
});

watch(properties.statusOptions, (newOptions) => {
  statusOptions.value = [...newOptions];
});

watch(isShowSearchPopup, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (searchInput.value) {
      searchInput.value.focus(); // ポップアップが表示されたら入力にフォーカス
    }
  }
});

// ページロード時にexecutorOptionsの要素をselectedExecutorに追加
onMounted(() => {
  selectedExecutor.value = [...executorOptions.value];
  selectedGroup.value = [...groupOptions.value];
  selectedPriority.value = [...priorityOptions.value];
  selectedStatus.value = [...statusOptions.value];
  if (properties.isStatusNeeded) {
    statusOptions.value = [...properties.statusOptions];
    selectedStatus.value = [...statusOptions.value];
  }
});

const showSearchPopup = (filterType) => {
  currentFilterType.value = filterType;
  isShowSearchPopup.value = true;
};

const closeSearchPopup = () => {
  isShowSearchPopup.value = false;
  searchKeyword.value = "";
};

const handleSearch = () => {
  if (searchKeyword.value) {
    switch (currentFilterType.value) {
      case "executor":
        executorOptions.value.push(searchKeyword.value);
        emits("addExecutorOption", searchKeyword.value);
        selectedExecutor.value.push(searchKeyword.value);
        emits("updateExecutor", selectedExecutor.value);
        break;
      case "group":
        groupOptions.value.push(searchKeyword.value);
        emits("addGroupOption", searchKeyword.value);
        selectedGroup.value.push(searchKeyword.value);
        emits("updateGroup", selectedGroup.value);
        break;
      case "priority":
        priorityOptions.value.push(searchKeyword.value);
        emits("addPriorityOption", searchKeyword.value);
        selectedPriority.value.push(searchKeyword.value);
        emits("updatePriority", selectedPriority.value);
        break;
      case "status":
        statusOptions.value.push(searchKeyword.value);
        emits("addStatusOption", searchKeyword.value);
        selectedStatus.value.push(searchKeyword.value);
        emits("updateStatus", selectedStatus.value);
        break;
    }
    searchKeyword.value = ""; // ポップアップを閉じずに検索キーワードをクリア
  }
};

const removeOption = (item) => {
  switch (currentFilterType.value) {
    case "executor":
      executorOptions.value = executorOptions.value.filter(
        (option) => option !== item
      );
      emits("removeExecutorOption", item);
      selectedExecutor.value = selectedExecutor.value.filter(
        (option) => option !== item
      );
      emits("updateExecutor", selectedExecutor.value);
      break;
    case "group":
      groupOptions.value = groupOptions.value.filter(
        (option) => option !== item
      );
      emits("removeGroupOption", item);
      selectedGroup.value = selectedGroup.value.filter(
        (option) => option !== item
      );
      emits("updateGroup", selectedGroup.value);
      break;
    case "priority":
      priorityOptions.value = priorityOptions.value.filter(
        (option) => option !== item
      );
      emits("removePriorityOption", item);
      selectedPriority.value = selectedPriority.value.filter(
        (option) => option !== item
      );
      emits("updatePriority", selectedPriority.value);
      break;
    case "status":
      statusOptions.value = statusOptions.value.filter(
        (option) => option !== item
      );
      emits("removeStatusOption", item);
      selectedStatus.value = selectedStatus.value.filter(
        (option) => option !== item
      );
      emits("updateStatus", selectedStatus.value);
      break;
  }
};

const filteredOptions = computed(() => {
  switch (currentFilterType.value) {
    case "executor":
      return executorOptions.value;
    case "group":
      return groupOptions.value;
    case "priority":
      return priorityOptions.value;
    case "status":
      return statusOptions.value;
    default:
      return [];
  }
});

const validateDates = () => {
  if (selectedStartDate.value && selectedEndDate.value) {
    if (selectedStartDate.value > selectedEndDate.value) {
      dateError.value = "Start date should be before end date";
    } else {
      dateError.value = "";
    }
  } else {
    dateError.value = "";
  }
};

const handleExecutorClick = (executor) => {
  const index = selectedExecutor.value.indexOf(executor);
  if (index === -1) {
    selectedExecutor.value.push(executor);
  } else {
    selectedExecutor.value.splice(index, 1);
    // executorOptionsから削除
    const executorIndex = executorOptions.value.indexOf(executor);
    if (executorIndex !== -1) {
      executorOptions.value.splice(executorIndex, 1);
      emits("removeExecutorOption", executor);
    }
  }
  emits("updateExecutor", selectedExecutor.value);
};

const handleGroupClick = (group) => {
  const index = selectedGroup.value.indexOf(group);
  if (index === -1) {
    selectedGroup.value.push(group);
  } else {
    selectedGroup.value.splice(index, 1);
    // groupOptionsから削除
    const groupIndex = groupOptions.value.indexOf(group);
    if (groupIndex !== -1) {
      groupOptions.value.splice(groupIndex, 1);
      emits("removeGroupOption", group);
    }
  }
  emits("updateGroup", selectedGroup.value);
};

const handlePriorityClick = (priority) => {
  const index = selectedPriority.value.indexOf(priority);
  if (index === -1) {
    selectedPriority.value.push(priority);
  } else {
    selectedPriority.value.splice(index, 1);
    // priorityOptionsから削除
    const priorityIndex = priorityOptions.value.indexOf(priority);
    if (priorityIndex !== -1) {
      priorityOptions.value.splice(priorityIndex, 1);
      emits("removePriorityOption", priority);
    }
  }
  emits("updatePriority", selectedPriority.value);
};

const handleStatusClick = (status) => {
  const index = selectedStatus.value.indexOf(status);
  if (index === -1) {
    selectedStatus.value.push(status);
  } else {
    selectedStatus.value.splice(index, 1);
    // statusOptionsから削除
    const statusIndex = statusOptions.value.indexOf(status);
    if (statusIndex !== -1) {
      statusOptions.value.splice(statusIndex, 1);
      emits("removeStatusOption", status);
    }
  }
  emits("updateStatus", selectedStatus.value);
};
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

.add-filter-btn {
  height: 24px;
  width: 24px;
  background-color: rgb(166, 166, 166);
  fill: black;
  cursor: pointer;
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
  background-color: #f3f4f6;
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

.search-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 背景を薄くぼかす */
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightgray;
  padding: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-popup-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-popup-content input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.search-popup-content button {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  cursor: pointer;
}

.search-results {
  width: 400px;
  display: flex;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.search-result-item {
  padding: 0.5rem;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 50vh;
  margin-top: 0.5rem;
  word-wrap: break-word;
}

.close-icon {
  height: 16px;
  width: 16px;
  background-color: rgb(166, 166, 166);
  fill: black;
  cursor: pointer;
}

.search-popup-footer {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.error-message {
  color: red;
}
</style>
