<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Navigation -->
    <PageNavigation 
      :project-name="'Project-A'" 
      :active-tab="activeTab" 
      :tabs="tabs"
      @update:active-tab="handleTabChange"
    />

    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <div class="diagram-container">
        <div class="gantt-content">
          <div class="chart-area">
            <div class="timeline-section">
              <div class="grid-container">
                <GridColumn
                  :key="index"
                  :date="date"
                />
              </div>

              <div class="tasks-container">
                <TaskItem
                  v-for="task in tasks"
                  :key="task.id"
                  :task="task"
                  :cell-width="cellWidth"
                  :start-date="dates[0]"
                />
              </div>

              <svg class="dependency-svg" :width="svgWidth" :height="svgHeight">
                <path
                  v-for="dep in dependencies"
                  :key="dep.from + '-' + dep.to"
                  :d="calculateDependencyPath(dep)"
                  class="dependency-line"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageNavigation from './navigation/Navigation.vue'
import TaskItem from './TaskItem.vue'
import GridColumn from './GridColumn.vue'
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'DiagramView',
  components: {
    PageNavigation,
    TaskItem,
    GridColumn
  },
  setup() {
    const activeTab = ref('Diagram')
    const tabs = ref(['Table', 'Kanban', 'Diagram'])

    const handleTabChange = (newTab) => {
      activeTab.value = newTab
    }

    return {
      activeTab,
      tabs,
      handleTabChange
    }
  },
  data() {
    return {
      cellWidth: 80,
      taskHeight: 40,
      dates: [],
      tasks: [
        {
          id: 1,
          name: 'Design Document',
          start: '2024-01-26',
          end: '2024-02-03',
          color: 'gray'
        },
        {
          id: 2,
          name: 'Development',
          start: '2024-02-10',
          end: '2024-02-17',
          color: 'gray'
        },
        {
          id: 3,
          name: 'Test',
          start: '2024-02-17',
          end: '2024-02-24',
          color: 'gray'
        },
        {
          id: 4,
          name: 'Release',
          start: '2024-02-24',
          end: '2024-03-02',
          color: 'gray'
        }
      ],
      dependencies: [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 }
      ]
    }
  },
  created() {
    this.dates = this.generateDates('2024-01-26', '2024-04-30')
  },
  computed: {
    svgWidth() {
      return this.dates.length * this.cellWidth
    },
    svgHeight() {
      return this.tasks.length * 120
    },
    horizontalLineCount() {
      return this.tasks.length
    }
  },
  methods: {
    generateDates(start, end) {
      const dates = []
      const current = new Date(start)
      const endDate = new Date(end)
      
      while (current <= endDate) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      return dates
    },
    formatDate(date) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return month + '/' + day
    },
    getXPosition(date) {
      const startDate = this.dates[0]
      const days = (date - startDate) / (1000 * 60 * 60 * 24)
      return days * (this.cellWidth / 7)
    },
    calculateDependencyPath(dep) {
      const fromTask = this.tasks.find(t => t.id === dep.from)
      const toTask = this.tasks.find(t => t.id === dep.to)
      
      const fromIndex = this.tasks.indexOf(fromTask)
      const toIndex = this.tasks.indexOf(toTask)
      
      const fromX = this.getXPosition(new Date(fromTask.end))
      const toX = this.getXPosition(new Date(toTask.start))
      
      const fromY = fromIndex * 120 + 60
      const toY = toIndex * 120 + 60
      
      const controlPointOffset = Math.min((toX - fromX) * 0.2, 40)
      
      return 'M ' + fromX + ' ' + fromY + ' C ' + 
             (fromX + controlPointOffset) + ' ' + fromY + ', ' + 
             (toX - controlPointOffset) + ' ' + toY + ', ' + 
             toX + ' ' + toY
    }
  }
})
</script>

<style scoped>
.diagram-container {
  padding: 20px;
  min-height: 600px;
  overflow: hidden;
}

.gantt-content {
  display: flex;
}

.chart-area {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

.timeline-section {
  position: relative;
  margin-left: 280px;
  min-width: 8000px;
}

.grid-container {
  display: flex;
  min-height: 480px;
  position: relative;
  background-color: white;
}

.tasks-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.dependency-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.dependency-line {
  fill: none;
  stroke: #999;
  stroke-width: 2;
}
</style> 