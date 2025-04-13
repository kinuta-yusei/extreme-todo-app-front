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
      :is-status-needed="false"
      :default-status="todo"
      :is-schedule-needed="true"
      @update-executor="updateExecutor"
      @update-group="updateGroup"
      @update-priority="updatePriority"
    />

    <!-- Kanban Board Container -->
    <div class="board-container">
      <div class="board-wrapper">
        <div
          v-for="column in columns"
          :key="column.id"
          class="column"
        >
          <div class="column-container">
            <div class="column-header">
              <svg
                class="open-with-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path d="M480-80 310-250l57-57 73 73v-166h80v165l72-73 58 58L480-80ZM250-310 80-480l169-169 57 57-72 72h166v80H235l73 72-58 58Zm460 0-57-57 73-73H560v-80h165l-73-72 58-58 170 170-170 170ZM440-560v-166l-73 73-57-57 170-170 170 170-57 57-73-73v166h-80Z" />
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
                <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
              </svg>
            </div>
            <div class="tasks-wrapper">
              <draggable
                v-model="column.tasks"
                :group="{ name: 'tasks', pull: true, put: true }"
                item-key="id"
                class="draggable-container"
                :data-column-id="column.id"
                :animation="150"
                ghost-class="ghost-card"
                drag-class="drag-card"
                chosen-class="chosen-card"
                :sort="true"
                :delay="10"
                :delay-on-touch-only="true"
                :touch-start-threshold="3"
                handle=".task-card"
                :fallback-tolerance="10"
                :force-fallback="false"
                :disabled="false"
                :empty-insert-threshold="30"
                @start="onTaskDragStart"
                @end="onTaskDragEnd"
              >
                <template #item="{ element }">
                  <div class="task-card">
                    <div class="task-container">
                      <div class="task-header">
                        <div class="task-title">
                          {{ element.title }}
                        </div>
                      </div>
                      <div class="task-footer">
                        <span class="task-id">{{ element.id }}</span>
                        <div class="task-icons">
                          <span class="priority-icon">{{
                            getPriorityIcon(element.priority)
                          }}</span>
                          <button class="p-1">
                            <div class="task-icons">
                              <span class="user-icon">👤</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 必要なライブラリとコンポーネントのインポート
import { ref, onMounted, nextTick } from "vue"; // Vue.jsのリアクティブAPI
import PageNavigation from "./navigation/Navigation.vue"; // ページナビゲーションコンポーネント
import TaskFilters from "./filters/TaskFilters.vue"; // タスクフィルターコンポーネント
import draggable from 'vuedraggable'; // ドラッグ＆ドロップ機能を提供するライブラリ

// State
const activeTab = ref("Kanban");

// Filter information
const selectedExecutor = ref(); // 選択された担当者（実行者）の状態を管理
const selectedGroup = ref(); // 選択されたグループの状態を管理
const selectedPriority = ref(); // 選択された優先度の状態を管理

const allTasks = ref([
  {
    id: "group1-1", // タスクの一意のID
    title: "Task 1", // タスクのタイトル
    content: "Content 1", // タスクの詳細内容
    assignee: "User1", // タスクの担当者
    group: "Group1", // タスクの所属グループ
    priority: "Critical", // タスクの優先度
    status: 0, // タスクの状態（0: TO DO, 1: IN PROGRESS, 2: IN REVIEW）
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
  columns.value = columns.value.map((column) => ({
    ...column,
    tasks: allTasks.value.filter((task) => task.status === column.id),
  }));
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

const columnTitleReferences = ref({});

const setColumnTitleSize = () => {
  for (const element of Object.values(columnTitleReferences.value)) {
    if (element) {
      const padding = 12;
      const columnTitleWidth = element.scrollWidth + padding;
      const columnTitleHeight = element.scrollHeight + padding;
      element.style.width = `${columnTitleWidth}px`;
      element.style.height = `${columnTitleHeight}px`;
    }
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

/**
 * ドラッグ開始時のイベントハンドラ
 * ドラッグ状態をアクティブにし、ボディにドラッグ中のクラスを追加
 */
const onTaskDragStart = () => {
  document.body.classList.add('dragging-active');
};

/**
 * ドラッグ終了時のイベントハンドラ
 * タスクの位置と状態を更新し、ドラッグ状態を解除
 */
const onTaskDragEnd = (event_) => {
  const { newIndex, to, from } = event_;

  // ドラッグ状態を解除
  document.body.classList.remove('dragging-active');

  try {
    // ドラッグ元とドロップ先のカラムIDを取得
    const fromColumnId = Number.parseInt(from.getAttribute('data-column-id'));
    const toColumnId = Number.parseInt(to.getAttribute('data-column-id'));

    // IDに基づいてカラムを取得
    const fromColumn = columns.value.find(col => col.id === fromColumnId);
    const toColumn = columns.value.find(col => col.id === toColumnId);

    if (!fromColumn || !toColumn) {
      return;
    }

    // 異なるカラム間の移動の場合のみ、タスクのステータスを更新
    if (fromColumnId !== toColumnId) {
      // 移動先カラムの新しい位置にあるタスクを取得
      const task = toColumn.tasks[newIndex];

      if (task) {
        // タスクのステータスを更新
        task.status = toColumn.id;
      }
    }
  } catch (error) {
    console.error('ドラッグ＆ドロップ処理中にエラーが発生しました:', error);
  }
};
</script>

<style scoped>
/* 変数の定義 - scopedスタイル内でアクセスできるように親要素に定義 */
.board-container {
  --column-header-height: 80px; /* カラムヘッダーの高さ */
  height: 900px;
  overflow-x: auto;
  padding: 1rem;
  white-space: nowrap; /* 横スクロールを許可 */
  will-change: transform; /* ブラウザにこの要素が変化することを事前に通知 */
  -webkit-overflow-scrolling: touch; /* iOSでスムーズなスクロール */
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
  height: var(--column-header-height); /* 変数を使用 */
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
  width: 100%;
  height: calc(100% - var(--column-header-height)); /* 変数を使用 */
  overflow-y: auto;
}

.draggable-container {
  min-height: 150px; /* タスクがない場合でも十分な高さを確保 */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 子要素を水平方向に中央揃え */
  gap: 12px; /* 間隔を広げる */
  padding: 12px 8px; /* パディングを増やす */
  border-radius: 8px;
  transition: all 0.2s ease; /* アニメーションをスムーズに */
  position: relative;
}

/* 空のコンテナスタイル - 非表示に設定 
 * タスクがないカラムの視覚的表示を制御
 * 最小高さは維持しつつ、背景色や境界線を非表示に設定
 */
.draggable-container:empty {
  min-height: 150px; /* ドラッグ用の高さは維持 */
  border: none; /* 境界線なし */
  background-color: transparent; /* 背景透明 */
  box-shadow: none; /* 影なし */
}

.task-card {
  background-color: white;
  min-height: 60px;
  width: 90%;
  margin: 4px auto; /* 上下マージンは4px、左右マージンは自動で中央揃え */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: move;
  cursor: grab; /* ドラッグ可能なことを視覚的に示す */
  transition: transform 0.15s ease, box-shadow 0.15s ease; /* 高速で自然なアニメーション */
  user-select: none; /* テキスト選択を防止 */
  touch-action: none; /* タッチデバイスでのスクロールとドラッグの競合を防ぐ */
  position: relative;
  z-index: 1;
  will-change: transform, opacity; /* GPUアクセラレーションのヒント */
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 2; /* ホバー時は前面に表示 */
}

/* ドラッグ中の要素のスタイル
 * ドラッグされているタスクの視覚的フィードバック
 */
.drag-card {
  cursor: grabbing; /* ドラッグ中のカーソルスタイル */
  transform: rotate(2deg) scale(1.05); /* 回転と拡大効果でドラッグ中を強調 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* より大きな影でフロート感を表現 */
  z-index: 10; /* ドラッグ中は最前面に表示 */
  opacity: 0.9; /* 少し透明にして視覚的に区別 */
}

/* ドラッグ中に元の位置に表示されるゴーストカードのスタイル
 * ドラッグ元の位置を示すための視覚的プレースホルダ
 */
.ghost-card {
  height: 80px; /* 高さを指定 */
  margin: 10px 0; /* 上下のマージン */
  width: 90%; /* 幅を指定 */
  opacity: 0.7; /* 半透明 */
  background: #f0f4f8; /* 薄い背景色 */
  border: 2px dashed #64748b; /* 破線の境界線 */
  box-shadow: none; /* 影なし */
  transform: none; /* 変形なし */
  transition: all 0.2s ease; /* アニメーション効果 */
}

/* sortable-ghostクラスのスタイル（ライブラリ内部で使用）
 * ドラッグ中に生成される要素のスタイル
 */
:deep(.sortable-ghost) {
  opacity: 0.7; /* 半透明 */
  background: #f0f4f8 !important; /* 薄い背景色（優先適用） */
  border: 2px dashed #64748b !important; /* 破線の境界線（優先適用） */
  height: 80px !important; /* 高さを固定（優先適用） */
  margin: 10px 0 !important; /* マージンを固定（優先適用） */
  width: 90% !important; /* 幅を固定（優先適用） */
  box-shadow: none !important; /* 影なし（優先適用） */
}

/* ドロップ位置マーカーのスタイル
 * ドロップ可能な位置を示す視覚的マーカー
 */
:deep(.sortable-fallback) {
  opacity: 0.4; /* フォールバック要素の透明度 */
}

/* 選択されたカードのスタイル
 * ドラッグのために選択された要素の視覚的フィードバック
 */
.chosen-card {
  background-color: #f8fafc; /* 選択時の背景色 */
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
.board-container::-webkit-scrollbar {
  /* スクロールバー自体のスタイル */
  height: 8px;
}

.board-container::-webkit-scrollbar-track {
  /* スクロールバーのトラック（スクロールバーが移動する背景部分）のスタイル */
  background: #f1f1f1;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb {
  /* スクロールバーのサム（ドラッグしてスクロールする部分）のスタイル */
  background: #888;
  border-radius: 4px;
}

.board-container::-webkit-scrollbar-thumb:hover {
  /* スクロールバーのサムにホバーしたときのスタイル */
  background: #555;
}
</style>

<style>
/* グローバルスタイル - ドラッグ操作中のカーソルを統一 
 * ドラッグ操作中はページ全体のカーソルをgrabbing（つかむ）スタイルに統一し、
 * ユーザーに視覚的なフィードバックを提供する
 */
body.dragging-active {
  cursor: grabbing; /* ドラッグ中のカーソルスタイル */
}

body.dragging-active * {
  cursor: grabbing !important; /* すべての子要素にもドラッグ中のカーソルスタイルを適用（優先） */
}
</style>
