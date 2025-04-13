<template>
  <div class="task-item">
    <div class="task-box">
      <div 
        class="task-label"
        :style="{ left: labelPosition + 'px' }"
      >{{ task.name }}</div>
      <svg class="task-svg" :width="svgWidth" height="120">
        <path
          :d="calculateTaskPath"
          :class="['task-bar', { 'task-bar-red': task.color === 'red' }]"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    },
    cellWidth: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    }
  },
  computed: {
    svgWidth() {
      return 800
    },
    labelPosition() {
      const startX = this.getXPosition(new Date(this.task.start))
      return startX - 280 // ラベルの幅分左にずらす
    },
    calculateTaskPath() {
      const startX = this.getXPosition(new Date(this.task.start))
      const endX = this.getXPosition(new Date(this.task.end))
      const width = endX - startX
      const height = 40
      const arrowWidth = height * 0.4
      const y = 40

      return 'M ' + startX + ' ' + y + ' ' +
             'L ' + (startX + width - arrowWidth) + ' ' + y + ' ' +
             'L ' + (startX + width) + ' ' + (y + height/2) + ' ' +
             'L ' + (startX + width - arrowWidth) + ' ' + (y + height) + ' ' +
             'L ' + startX + ' ' + (y + height) + ' ' +
             'Z'
    }
  },
  methods: {
    getXPosition(date) {
      const days = (date - this.startDate) / (1000 * 60 * 60 * 24)
      return days * (this.cellWidth / 7)
    }
  }
}
</script>

<style scoped>
.task-item {
  height: 120px;
}

.task-box {
  height: 100%;
  position: relative;
  z-index: 2;
}

.task-label {
  position: absolute;
  width: 260px;
  padding-right: 20px;
  text-align: right;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  top: 40px;
  z-index: 2;
}

.task-svg {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}

.task-bar {
  fill: #e0e0e0;
  stroke: #ccc;
  stroke-width: 1;
}
</style> 