<template>
  <div class="grid-column">
    <div class="date-cell">
      {{ formatDate(date) }}
    </div>
    <div class="grid-line"></div>
  </div>
</template>

<script>
export default {
  name: 'GridColumn',
  props: {
    date: {
      type: Date,
      required: true
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
.grid-column {
  width: 80px;
  flex: 0 0 80px;
  position: relative;
  height: 100%;
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
  background-color: #e5e7eb;
}

/* 最初のカラムの左端にもグリッド線を表示 */
.grid-column:first-child::before {
  content: '';
  position: absolute;
  left: -80px;
  top: 24px;
  bottom: 0;
  width: 1px;
  background-color: #e5e7eb;
}
</style> 