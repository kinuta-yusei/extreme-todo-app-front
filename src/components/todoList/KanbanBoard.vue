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
      :isStatusNeeded="true"
      :status-options="['todo', 'inProgress', 'inReview']"
      :default-status="todo"
      :isScheduleNeeded="true"
      @updateExecutor="updateExecutor"
      @updateGroup="updateGroup"
      @updatePriority="updatePriority"
    />

    <div class="filter-label">{{ selectedExecutor }}</div>
    <div class="filter-label">{{ selectedGroup }}</div>
    <div class="filter-label">{{ selectedPriority }}</div>

    <!-- Create Task Button -->
    <button
      @click="openCreateTaskModal"
      class="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <PlusIcon class="w-4 h-4 inline-block mr-2" />
      Create New Task
    </button>

    <!-- Kanban Board Container -->
    <div class="board-container overflow-x-auto bg-gray-200 p-4 rounded-lg">
      <div class="board-wrapper flex gap-6">
        <draggable
          v-model="columns"
          :group="{ name: 'columns' }"
          item-key="id"
          handle=".column-header"
          class="columns-wrapper flex gap-6"
          @change="handleColumnDragChange"
        >
          <!-- header of each status -->
          <template #item="{ element: column /* index */ }">
            <div class="kanban-column bg-gray-300 rounded-lg w-[400px]">
              <div
                class="column-header bg-gray-400 p-4 rounded-t-lg flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <button
                    class="settings-btn"
                    @click="openColumnSettings(column.id)"
                  >
                    <SettingsIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <span class="font-medium column-title">{{
                    column.title
                  }}</span>
                </div>
                <span class="task-count bg-gray-500 px-2 rounded-full">
                  {{ column.tasks.length }}
                </span>
                <button class="more-btn">
                  <MoreHorizontalIcon class="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <!-- tasks in each status -->
              <draggable
                v-model="column.tasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                handle=".drag-handle"
                class="tasks-wrapper"
                @change="handleTaskDragChange"
              >
                <template #item="{ element }">
                  <div
                    class="task-card drag-handle bg-white p-4 rounded-lg shadow mb-3"
                  >
                    <div class="task-header flex justify-between items-center">
                      <div class="flex-grow ml-2">
                        <h3 class="font-medium">{{ element.title }}</h3>
                      </div>
                    </div>
                    <!-- タスクの内容 -->
                    <div class="task-footer mt-2 flex gap-2">
                      <div class="task-content mt-2 flex items-center gap-2">
                        <span>{{ element.id }}</span>
                        <div class="flex-grow"></div>
                        <div class="task-icons">
                          <span class="priority-icon">{{ getPriorityIcon(element.priority) }}</span>
                        </div>
                        <button class="p-1">
                          <div class="task-icons">
                            <span class="user-icon">👤</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Task Modal -->
    <Modal v-if="showTaskModal" @close="closeTaskModal">
      <template #header>
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Edit Task" : "Create New Task" }}
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
            <label class="block text-sm font-medium text-gray-700"
              >Ticket Number</label
            >
            <input
              v-model="taskForm.ticketNumber"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Priority</label
            >
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
            <label class="block text-sm font-medium text-gray-700"
              >Assignee</label
            >
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

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              v-model="taskForm.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option v-for="task in tasks" :key="task.id" :value="task.status">
                {{ task.status }}
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
            {{ isEditing ? "Update" : "Create" }}
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
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import Modal from "./KanbanModal.vue";
import PageNavigation from "./navigation/Navigation.vue";
import TaskFilters from "./filters/TaskFilters.vue";
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import { useGroupStore } from "@/stores/group";

// Stores
const taskStore = useTaskStore();
const userStore = useUserStore();
const groupStore = useGroupStore();

// State
const activeTab = ref("Kanban");
const showTaskModal = ref(false);
const showColumnSettingsModal = ref(false);
const isEditing = ref(false);
const selectedTask = ref(null);
const selectedColumn = ref(null);

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
const taskForm = ref({
  title: "",
  ticketNumber: "",
  priority: "minor",
  assignee: "",
  group: "",
  status: "todo",
});

const columnSettingsForm = ref({
  title: "",
});

// Methods

// const getFilteredTasks = (status) => {
//   return tasks.value.filter((task) => task.status === status);
// };

const updateExecutor = (executor) => {
  selectedExecutor.value = executor;
};

const updateGroup = (group) => {
  selectedGroup.value = group;
};

const updatePriority = (priority) => {
  selectedPriority.value = priority;
};
const openCreateTaskModal = () => {
  isEditing.value = false;
  taskForm.value = {
    title: "",
    ticketNumber: "",
    priority: "minor",
    assignee: "",
    group: "",
    status: "todo",
  };
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const handleTaskSubmit = async () => {
  if (isEditing.value) {
    await taskStore.updateTask({
      ...selectedTask.value,
      ...taskForm.value,
    });
  } else {
    await taskStore.createTask(taskForm.value);
  }
  closeTaskModal();
  fetchInitialData();
};

const openColumnSettings = (columnId) => {
  selectedColumn.value = columnId;
  columnSettingsForm.value.title = columns.value.find(
    (c) => c.id === columnId
  ).title;
  showColumnSettingsModal.value = true;
};

const closeColumnSettingsModal = () => {
  showColumnSettingsModal.value = false;
  selectedColumn.value = null;
};

const handleColumnSettingsSubmit = async () => {
  if (selectedColumn.value) {
    await taskStore.updateColumn({
      ...columns.value.find((c) => c.id === selectedColumn.value),
      title: columnSettingsForm.value.title,
    });
  }
  closeColumnSettingsModal();
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

// Computed
const users = computed(() => userStore.users);
const groups = computed(() => groupStore.groups);
const tasks = computed(() => taskStore.tasks);
// Fetch initial data
onMounted(async () => {
  // バックエンドができていない場合はサンプルデータを使用
  fetchInitialData();

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
.kanban-container {
  display: flex;
  gap: 1.5rem;
}

.board-container {
  overflow-x: auto;
  padding: 1rem;
  white-space: nowrap; /* 横スクロールを許可 */
}

.board-wrapper {
  display: flex; /* 横並びにするためにフレックスボックスを使用 */
  gap: 1.5rem;
  flex-wrap: nowrap; /* 折り返しなし */
  overflow-x: auto; /* 横スクロール可能にする */
}

.columns-wrapper {
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap; /* 折り返しなしで横並びを維持 */
}

.kanban-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 1000px;
  width: 300px;
  background-color: #e5e7eb; /* 背景色を灰色に設定 */
  border-radius: 16px; /* ここで淵を曲線に設定 */
  flex-shrink: 0; /* 縮小しないように固定 */
  box-sizing: border-box; /* パディングとボーダーを含めた幅の計算 */
  padding: 0; /* パディングを削除 */
}

.column-header {
  height: 10%; /* お好みの高さに調整 */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  gap: 16px; /* アイコンとテキストの間隔を広げる */
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  cursor: move; /* ドラッグ可能にするためのスタイル */
  background-color: #d1d5db; /* 背景色を灰色に設定 */
  border-top-left-radius: 16px; /* ここで淵を曲線に設定 */
  border-top-right-radius: 16px; /* ここで淵を曲線に設定 */
  overflow: hidden; /* 内容がはみ出ないようにする */
  white-space: nowrap; /* テキストが折り返さないようにする */
  text-overflow: ellipsis;
}

.column-header SettingsIcon {
  width: 100%; /* 画像サイズを適宜調整 */
  height: 40px;
  margin-right: 20px; /* 画像とテキストの間隔 */
}

.column-title {
  padding: 4px 12px; /* テキストの周りの余白 */
  background-color: #828080; /* 背景色（適宜変更） */
  color: white; /* 文字色 */
  font-weight: bold;
  border-radius: 8px; /* 角を丸める */
  margin-left: 20px; /* アイコンとテキストの間隔 */
}

.task-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
  width: 250px;
  margin: 4px 0;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* パディングとボーダーを含めた幅の計算 */
  cursor: move;
}

.task-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.task-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.task-content-text {
  font-size: 1rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}


.task-assignee {
  font-size: 0.875rem;
  color: #6b7280; /* グレー */
}

.task-priority {
  font-size: 0.875rem;
  color: #6b7280; /* グレー */
}

.task-id {
  font-size: 0.875rem;
  color: #6b7280;
}

.task-icons {
  display: flex;
  gap: 0.5rem;
}

/* カスタムスクロールバー */
.board-container::-webkit-scrollbar {
  height: 8px;
}

.board-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

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
  background-color: #f3f4f6;
}
</style>
