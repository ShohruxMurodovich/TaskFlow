<template>
  <div class="kanban-board">
    <!-- Columns -->
    <div 
      v-for="status in ['To Do', 'In Progress', 'Done']" 
      :key="status"
      class="kanban-column"
      @dragover.prevent
      @drop="onDrop($event, status)"
    >
      <div class="column-header" :class="status.toLowerCase().replace(' ', '-')">
        <div class="header-title">
          <span class="status-dot"></span>
          <h3>{{ status }}</h3>
          <span class="count">{{ getTasksByStatus(status).length }}</span>
        </div>
      </div>

      <div class="column-content">
        <div
          v-for="task in getTasksByStatus(status)"
          :key="task._id"
          class="kanban-card"
          draggable="true"
          @dragstart="onDragStart($event, task)"
          @click="$emit('edit-task', task)"
        >
          <div class="card-badges">
            <span 
              class="priority-badge"
              :class="task.priority.toLowerCase()"
            >
              {{ task.priority }}
            </span>
            <span v-if="task.project" class="project-badge">
              {{ task.project.name }}
            </span>
          </div>
          
          <h4 class="card-title">{{ task.title }}</h4>
          
          <div class="card-footer">
            <div class="due-date" v-if="task.dueDate">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(task.dueDate) }}</span>
            </div>
            
            <el-avatar :size="24" class="user-avatar">
              {{ getInitials(task.user?.name) }}
            </el-avatar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar } from '@element-plus/icons-vue';
import { useTaskStore } from '~/stores/tasks';
import dayjs from 'dayjs';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit-task']);
const taskStore = useTaskStore();

const getTasksByStatus = (status) => {
  return props.tasks.filter(t => t.status === status);
};

const formatDate = (date) => {
  return dayjs(date).format('MMM D');
};

const getInitials = (name) => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
};

// Drag and Drop Logic
const onDragStart = (event, task) => {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('taskId', task._id);
};

const onDrop = async (event, status) => {
  const taskId = event.dataTransfer.getData('taskId');
  const task = props.tasks.find(t => t._id === taskId);
  
  if (task && task.status !== status) {
    await taskStore.updateTask(taskId, { status });
  }
};
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  height: 100%;
  overflow-x: auto;
  min-height: 500px;
}

.kanban-column {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;
}

.column-header {
  padding: var(--space-4);
  border-bottom: 2px solid transparent;
}

.column-header.to-do { border-bottom-color: var(--status-todo); }
.column-header.in-progress { border-bottom-color: var(--status-progress); }
.column-header.done { border-bottom-color: var(--status-done); }

.header-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header-title h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.count {
  background: rgba(0,0,0,0.05);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.kanban-card {
  background: var(--bg-card);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  cursor: grab;
  transition: all 0.2s ease;
}

.kanban-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--primary-light);
}

.kanban-card:active {
  cursor: grabbing;
}

.card-badges {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.priority-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high { background: var(--priority-high-bg); color: var(--priority-high); }
.priority-badge.medium { background: var(--priority-medium-bg); color: var(--priority-medium); }
.priority-badge.low { background: var(--priority-low-bg); color: var(--priority-low); }

.project-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--bg-hover);
  color: var(--text-secondary);
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title {
  margin: 0 0 var(--space-4) 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
