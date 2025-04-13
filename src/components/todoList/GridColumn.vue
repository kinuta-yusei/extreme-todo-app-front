<template>
  <div class="grid-container">
    <div v-for="(date, index) in dates" :key="index" class="grid-column">
      <div class="date-cell">{{ formatDate(date) }}</div>
      <div class="grid-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridColumn',
  data() {
    return {
      // 今日から100日分の日付を生成
      dates: Array.from({ length: 100 }, (_, index) => {
        const date = new Date('2024-01-01')
        date.setDate(date.getDate() + index)
        return date
      })
    }
  },
  methods: {
    formatDate(date) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return month + '/' + day
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: flex;
  position: relative;
  width: 100%;
  height: 300px; /* コンテナに明示的な高さを設定 */
  border: 1px solid #eee;
  overflow: visible;
}

.grid-column {
  width: 80px;
  flex: 0 0 80px;
  position: relative;
  height: 100%;
  min-height: 200px; /* 最小高さを設定 */
}

.date-cell {
  position: absolute;
  width: 80px;
  text-align: center;
  top: 0;
  left: -40px;
  padding: 4px 0;
  color: #666;
  font-size: 12px;
}

.grid-line {
  position: absolute;
  top: 24px;
  bottom: 0;
  left: 0;
  width: 1px;
  background-color: #ccc; /* グリッド線の色 */
}

.tasks-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: auto; /* 変更 */
}
</style>