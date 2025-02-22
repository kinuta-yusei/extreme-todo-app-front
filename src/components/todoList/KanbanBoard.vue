<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Kanban Board'" 
      :active-tab="'Kanban'"
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
      :isStatusNeeded="false"
      :default-status="todo"
      :isScheduleNeeded="true"
      @updateExecutor="updateExecutor" 
      @updateGroup="updateGroup" 
      @updatePriority="updatePriority" 
    />

    <!-- Kanban Board Container -->
    <div class="board-container">
      <div class="board-wrapper">
        <div v-for="column in columns" :key="column.id" class="column">
          <div class="column-container">
            <div class="column-header">
              <svg
                class="open-with-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M480-80 310-250l57-57 73 73v-166h80v165l72-73 58 58L480-80ZM250-310 80-480l169-169 57 57-72 72h166v80H235l73 72-58 58Zm460 0-57-57 73-73H560v-80h165l-73-72 58-58 170 170-170 170ZM440-560v-166l-73 73-57-57 170-170 170 170-57 57-73-73v166h-80Z"
                />
              </svg>
              <div
                ref="el => columnTitleRefs[column.id] = el"
                class="column-title"
              >
                {{ column.title }}
              </div>
              <span class="task-count bg-gray-500 px-2 rounded-full">
                {{ column.tasks.length }}
              </span>
              <svg
                class="more-horizontal-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
                />
              </svg>
            </div>
            <div class="tasks-wrapper">
              <div v-for="task in column.tasks" :key="task.id" class="task-card">
                <div class="task-container">
                  <div class="task-header">
                    <div class="task-title">{{ task.title }}</div>
                  </div>
                  <div class="task-footer">
                    <span class="task-id">{{ task.id }}</span>
                    <div class="task-icons">
                      <span class="priority-icon">{{ getPriorityIcon(task.priority) }}</span>
                      <button class="p-1">
                        <div class="task-icons">
                          <span class="user-icon">👤</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import PageNavigation from "./navigation/Navigation.vue";
import TaskFilters from "./filters/TaskFilters.vue";

// State
const activeTab = ref("Kanban");

// Filter information
const selectedExecutor = ref(null); // need to add other page's setting
const selectedGroup = ref(null);
const selectedPriority = ref(null);

const allTasks = ref([
  {
    id: "group1-1",
    title: "Task 1",
    content: "Content 1",
    assignee: "User1",
    group: "Group1",
    priority: "Critical",
    status: 0,
  },
  {
    id: "group2-1",
    title: "Task 2",
    content: "Content 2",
    assignee: "User2",
    group: "Group2",
    priority: "Urgent",
    status: 0,
  },
  {
    id: "group3-1",
    title: "Task 3",
    content: "Content 3",
    assignee: "User3",
    group: "Group3",
    priority: "Minor",
    status: 1,
  },
  {
    id: "group4-1",
    title: "Task 4",
    content: "Content 4",
    assignee: "User4",
    group: "Group4",
    priority: "Backlog",
    status: 2,
  },
]); // サンプルデータを設定

const columns = ref([
  { id: 0, title: "TO DO", tasks: [] },
  { id: 1, title: "IN PROGRESS", tasks: [] },
  { id: 2, title: "IN REVIEW", tasks: [] },
]);
const executorOptions = ref([
  "User1",
  "User2",
  "User3",
  "User4",
  "User5",
  "User6",
  "User7",
]);
const groupOptions = ref([
  "Group1",
  "Group2",
  "Group3",
  "Group4",
  "Group5",
  "Group6",
  "Group7",
]);
const priorityOptions = ref(["Critical", "Urgent", "Minor", "Backlog"]);

const updateExecutor = (executor) => {
  selectedExecutor.value = executor;
};

const updateGroup = (group) => {
  selectedGroup.value = group;
};

const updatePriority = (priority) => {
  selectedPriority.value = priority;
};

const fetchInitialData = async () => {
  // const response = await axios.get('http://localhost:3000/todos');
  // allTasks.value = response.data;
  distributeTasksByStatus();
};

const distributeTasksByStatus = () => {
  columns.value.forEach((column) => {
    column.tasks = allTasks.value.filter((task) => task.status === column.id);
  });
};
// 優先度に応じたアイコンを返す
const getPriorityIcon = (priority) => {
  const icons = {
    Critical: "⛔️",
    Urgent: "⚠️",
    Minor: "✅",
    Backlog: "📌",
  };
  return icons[priority] || "❔";
};

const columnTitle = ref(null);

const setColumnTitleSize = () => {
  if (columnTitle.value) {
    const padding = 12;
    const columnTitleWidth = columnTitle.value.scrollWidth + padding;
    const columnTitleHeight = columnTitle.value.scrollHeight + padding;
    columnTitle.value.style.width = `${columnTitleWidth}px`;
    columnTitle.value.style.height = `${columnTitleHeight}px`;
  }
};
// Fetch initial data
onMounted(async () => {
  // バックエンドができていない場合はサンプルデータを使用
  await fetchInitialData();
  await nextTick();
  setColumnTitleSize();
  window.addEventListener("resize", setColumnTitleSize);
  // バックエンドができた場合は以下のコードを有効にする
  // await Promise.all([
  //   taskStore.fetchTasks(),
  //   userStore.fetchUsers(),
  //   groupStore.fetchGroups(),
  // ]);
  // allTasks.value = taskStore.tasks;
  // distributeTasksByStatus();
});
</script>

<style scoped>
.board-container {
  height: 900px;
  overflow-x: auto;
  padding: 1rem;
  white-space: nowrap; /* 横スクロールを許可 */
}

.board-wrapper {
  height: 100%;
  width: 100%;
  display: flex; /* 横並びにするためにフレックスボックスを使用 */
  flex-wrap: nowrap; /* 要素の折り返しなし */
  overflow-x: auto; /* 横スクロール可能にする */
}

.column {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 0.5rem;
  border-radius: 16px; /* ここで淵を曲線に設定 */
}

.column-container {
  height: 100%;
  width: 100%;
  border-radius: 16px; /* ここで淵を曲線に設定 */
  background-color: #e5e7eb; /* 背景色を灰色に設定 */
}

.column-header {
  height: 80px; /* お好みの高さに調整 */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px 16px 0 0; /* ここで淵を曲線に設定 */
  background-color: #d1d5db; /* 背景色を灰色に設定 */
}

.column-title {
  height: 30px;
  padding: 0px 12px; /* テキストの周りの余白 */
  background-color: #828080; /* 背景色 */
  display: inline-block;
  color: white; /* 文字色 */
  font-weight: bold;
  border-radius: 8px; /* 角を丸める */
  text-align: center;
  /* margin-left: 20%; 左の余白 */
}

.open-with-icon {
  height: 24px;
  width: 24px;
  margin-right: 8px; /* 画像とテキストの間隔 */
  fill: #000000;
  cursor: move;
}

.task-count {
  padding-right: 0.5rem; /* 右のパディングを設定 */
}

.more-horizontal-icon {
  height: 24px;
  width: 24px;
  fill: #000000;
}

.tasks-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.task-card {
  background-color: white;
  min-height: 60px;
  width: 250px;
  margin: 4px 0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: move;
}

.task-header {
  text-align: center;
  font-weight: bold;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-id {
  font-size: 0.875rem;
  color: #6b7280;
}

.task-icons {
  display: flex;
  gap: 8px;
}

.task-title {
  font-size: 1.25rem;
  font-weight: bold;
}

/* カスタムスクロールバー */
.board-container::-webkit-scrollbar { /* スクロールバー自体のスタイル */
  height: 8px;
}

.board-container::-webkit-scrollbar-track { /* スクロールバーのトラック（スクロールバーが移動する背景部分）のスタイル */
  background: #f1f1f1;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb { /* スクロールバーのサム（ドラッグしてスクロールする部分）のスタイル */
  background: #888;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb:hover { /* スクロールバーのサムにホバーしたときのスタイル */
  background: #555;
}
</style>
