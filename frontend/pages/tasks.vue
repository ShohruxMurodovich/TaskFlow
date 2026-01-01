<template>
  <NuxtLayout>
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Tasks</h1>
          <p class="page-subtitle">{{ taskStore.filteredTasks.length }} tasks</p>
        </div>
        
        <div class="header-actions" style="display: flex; gap: 16px; align-items: center;">
          <!-- View Toggle -->
          <el-radio-group v-model="viewMode" size="large">
            <el-radio-button label="list">
              <el-icon class="mr-1"><Memo /></el-icon> List
            </el-radio-button>
            <el-radio-button label="board">
              <el-icon class="mr-1"><DataBoard /></el-icon> Kanban
            </el-radio-button>
          </el-radio-group>

          <el-button type="primary" :icon="Plus" @click="openTaskDrawer(null)">
            New Task
          </el-button>
        </div>
      </div>

      <!-- Filters Bar -->
      <el-card class="filters-card premium-card" shadow="never">
        <div class="filters-grid">
          <el-input
            v-model="searchQuery"
            placeholder="Search tasks..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />

          <el-select
            v-model="filters.project"
            placeholder="All Projects"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="project in projectStore.projects"
              :key="project._id"
              :label="project.name"
              :value="project._id"
            />
          </el-select>

          <el-select
            v-model="filters.status"
            placeholder="All Statuses"
            clearable
            @change="handleFilterChange"
          >
            <el-option label="To Do" value="To Do" />
            <el-option label="In Progress" value="In Progress" />
            <el-option label="Done" value="Done" />
          </el-select>

          <el-select
            v-model="filters.priority"
            placeholder="All Priorities"
            clearable
            @change="handleFilterChange"
          >
            <el-option label="Low" value="Low" />
            <el-option label="Medium" value="Medium" />
            <el-option label="High" value="High" />
          </el-select>

          <el-button @click="clearFilters" :icon="RefreshLeft">
            Reset
          </el-button>
        </div>
      </el-card>

      <!-- Content Area -->
      <div v-if="viewMode === 'list'">
        <!-- Tasks Table -->
        <el-card class="premium-card" shadow="never">
          <el-table
            v-loading="taskStore.loading"
            :data="displayedTasks"
            style="width: 100%"
            stripe
          >
            <el-table-column prop="title" label="Task" min-width="250">
              <template #default="{ row }">
                <div style="font-weight: 500; color: var(--text-primary);">
                  {{ row.title }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Project" width="180">
              <template #default="{ row }">
                {{ row.project?.name || 'N/A' }}
              </template>
            </el-table-column>

            <el-table-column label="Status" width="160">
              <template #default="{ row }">
                <div class="status-badge" :class="getStatusClass(row.status)">
                  <span class="status-dot"></span>
                  {{ row.status }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Priority" width="120">
              <template #default="{ row }">
                <div class="priority-badge" :class="getPriorityClass(row.priority)">
                  {{ row.priority }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Due Date" width="150">
              <template #default="{ row }">
                <div v-if="row.dueDate" class="due-date" :class="{ 'is-overdue': isOverdue(row.dueDate) && row.status !== 'Done' }">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(row.dueDate) }}</span>
                </div>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" width="100" align="center">
              <template #default="{ row }">
                <el-dropdown trigger="click">
                  <el-button class="action-btn" text circle>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :icon="ChatDotRound" @click="openTaskDrawer(row)">Comments</el-dropdown-item>
                      <el-dropdown-item :icon="Edit" @click="openTaskDrawer(row)">View Details</el-dropdown-item>
                      <el-dropdown-item :icon="Delete" @click="confirmDelete(row._id)" divided class="text-danger">Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>

            <template #empty>
              <el-empty description="No tasks found">
                <el-button type="primary" :icon="Plus" @click="openTaskDrawer(null)">
                  Create First Task
                </el-button>
              </el-empty>
            </template>
          </el-table>
        </el-card>
      </div>

      <!-- Kanban View -->
      <div v-else class="kanban-view" style="height: calc(100vh - 300px);">
        <KanbanBoard :tasks="displayedTasks" @edit-task="openTaskDrawer" />
      </div>

      <!-- Task Drawer -->
      <el-drawer
        v-model="drawerVisible"
        :title="isEdit ? (isDetailsView ? 'Task Details' : 'Edit Task') : 'New Task'"
        size="600px"
        :close-on-click-modal="false"
        class="task-drawer"
      >
        <!-- View Mode -->
        <div v-if="isDetailsView && isEdit" class="task-details-view">
          <div class="details-header">
            <div class="badges">
              <el-tag :type="getStatusType(taskForm.status)" effect="dark" class="mr-2">{{ taskForm.status }}</el-tag>
              <el-tag :type="getPriorityType(taskForm.priority)" effect="plain">{{ taskForm.priority }} Priority</el-tag>
            </div>
            <el-button type="primary" link :icon="Edit" @click="switchToEditMode">Edit Task</el-button>
          </div>

          <h2 class="detail-title">{{ taskForm.title }}</h2>
          
          <div class="detail-meta">
             <div class="meta-item" v-if="taskForm.project">
               <el-icon><Folder /></el-icon>
               <span>{{ getProjectName(taskForm.project) }}</span>
             </div>
             <div class="meta-item" v-if="taskForm.dueDate">
               <el-icon><Calendar /></el-icon>
               <span>{{ formatDate(taskForm.dueDate) }}</span>
             </div>
          </div>

          <div class="detail-description" v-if="taskForm.description">
            <p>{{ taskForm.description }}</p>
          </div>
          <div class="detail-description empty" v-else>
            <p>No description provided.</p>
          </div>

          <el-divider />
          
          <TaskComments :taskId="currentTaskId" />
        </div>

        <!-- Edit/Create Mode -->
        <div v-else>
          <el-form
            ref="taskFormRef"
            :model="taskForm"
            :rules="rules"
            label-position="top"
          >
            <el-form-item label="Task Title" prop="title">
              <el-input
                v-model="taskForm.title"
                placeholder="What needs to be done?"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="Description">
              <el-input
                v-model="taskForm.description"
                type="textarea"
                :rows="4"
                placeholder="Add details..."
                maxlength="1000"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="Project" prop="project">
              <el-select
                v-model="taskForm.project"
                placeholder="Select project..."
                style="width: 100%"
              >
                <el-option
                  v-for="project in projectStore.projects"
                  :key="project._id"
                  :label="project.name"
                  :value="project._id"
                />
              </el-select>
            </el-form-item>

            <div class="form-row">
              <el-form-item label="Status">
                <el-select v-model="taskForm.status" style="width: 100%">
                  <el-option label="To Do" value="To Do" />
                  <el-option label="In Progress" value="In Progress" />
                  <el-option label="Done" value="Done" />
                </el-select>
              </el-form-item>

              <el-form-item label="Priority">
                <el-select v-model="taskForm.priority" style="width: 100%">
                  <el-option label="Low" value="Low" />
                  <el-option label="Medium" value="Medium" />
                  <el-option label="High" value="High" />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="Due Date">
              <el-date-picker
                v-model="taskForm.dueDate"
                type="date"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>

          <div class="drawer-footer">
            <el-button @click="drawerVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSave" :loading="saving">
              {{ isEdit ? 'Save Changes' : 'Create Task' }}
            </el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {
  Plus,
  Search,
  RefreshLeft,
  Edit,
  Delete,
  Clock,
  Loading,
  CircleCheck,
  Warning,
  MoreFilled,
  Calendar,
  Memo,
  DataBoard,
  ChatDotRound,
  Folder
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import KanbanBoard from '~/components/KanbanBoard.vue';
import TaskComments from '~/components/TaskComments.vue'; // Ensure import

definePageMeta({
  middleware: 'auth'
});

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const getProjectName = (id) => {
  const p = projectStore.projects.find(p => p._id === id);
  return p ? p.name : 'Unknown Project';
};

const getStatusType = (status) => {
  if (status === 'Done') return 'success';
  if (status === 'In Progress') return 'warning';
  return 'info';
};

const getPriorityType = (priority) => {
  if (priority === 'High') return 'danger';
  if (priority === 'Medium') return 'warning';
  return 'success'; // Low
};

// View Mode
const viewMode = ref('list'); // 'list' or 'board'

const drawerVisible = ref(false);
const saving = ref(false);
const isEdit = ref(false);
const isDetailsView = ref(false); // New state for Details/View mode
const currentTaskId = ref(null);
const searchQuery = ref('');

const filters = ref({
  project: '',
  status: '',
  priority: ''
});

const taskFormRef = ref();
const taskForm = ref({
  title: '',
  description: '',
  project: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: null
});

const rules = {
  title: [
    { required: true, message: 'Task title is required', trigger: 'blur' },
    { min: 3, message: 'Title must be at least 3 characters', trigger: 'blur' }
  ],
  project: [
    { required: true, message: 'Please select a project', trigger: 'change' }
  ]
};

const displayedTasks = computed(() => {
  let tasks = taskStore.filteredTasks;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }
  
  return tasks;
});

const getStatusClass = (status) => {
  const map = {
    'To Do': 'status-todo',
    'In Progress': 'status-progress',
    'Done': 'status-done'
  };
  return map[status] || '';
};

const getPriorityClass = (priority) => {
  const map = {
    'Low': 'priority-low',
    'Medium': 'priority-medium',
    'High': 'priority-high'
  };
  return map[priority] || '';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

const handleSearch = () => {
  // Search is handled by computed property
};

const handleFilterChange = () => {
  taskStore.setFilters(filters.value);
};

const clearFilters = () => {
  filters.value = {
    project: '',
    status: '',
    priority: ''
  };
  searchQuery.value = '';
  taskStore.clearFilters();
};

const openTaskDrawer = (task) => {
  if (task) {
    isEdit.value = true;
    isDetailsView.value = true;
    currentTaskId.value = task._id;
    taskForm.value = {
      title: task.title,
      description: task.description || '',
      project: task.project._id,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    };
  } else {
    isEdit.value = false;
    isDetailsView.value = false;
    currentTaskId.value = null;
    taskForm.value = {
      title: '',
      description: '',
      project: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: null
    };
  }
  drawerVisible.value = true;
};

const switchToEditMode = () => {
  isDetailsView.value = false;
};

const handleSave = async () => {
  if (!taskFormRef.value) return;

  const valid = await taskFormRef.value.validate();
  if (!valid) return;

  saving.value = true;

  let result;
  if (isEdit.value) {
    result = await taskStore.updateTask(currentTaskId.value, taskForm.value);
  } else {
    result = await taskStore.createTask(taskForm.value);
  }

  if (result.success) {
    ElMessage.success({
      message: `Task ${isEdit.value ? 'updated' : 'created'} successfully`,
      type: 'success'
    });
    drawerVisible.value = false;
  } else {
    ElMessage.error(result.message);
  }

  saving.value = false;
};

const confirmDelete = (id) => {
  const task = taskStore.filteredTasks.find(t => t._id === id);
  ElMessageBox.confirm(
    `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
    'Delete Task',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(async () => {
    const result = await taskStore.deleteTask(id);
    if (result.success) {
      ElMessage.success('Task deleted successfully');
    } else {
      ElMessage.error(result.message);
    }
  }).catch(() => {
    // Cancelled
  });
};

onMounted(async () => {
  // Fetch projects first for dropdowns
  await projectStore.fetchProjects();
  
  // Then fetch tasks
  const result = await taskStore.fetchTasks();
  if (!result.success) {
    ElMessage.error(result.message);
  }
});
</script>

<style scoped>
/* Task Details View Styles */
.task-details-view {
  padding-bottom: 20px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.3;
}

.detail-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 24px;
  white-space: pre-wrap;
}

.detail-description.empty {
  color: var(--text-muted);
  font-style: italic;
}

.drawer-footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  text-align: right;
}

.filters-card {
  margin-bottom: var(--space-6);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: var(--space-4);
  align-items: center;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

/* Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-todo { background: var(--status-todo-bg); color: var(--status-todo); }
.status-todo .status-dot { background: currentColor; }

.status-progress { background: var(--status-progress-bg); color: var(--status-progress); }
.status-progress .status-dot { background: currentColor; }

.status-done { background: var(--status-done-bg); color: var(--status-done); }
.status-done .status-dot { background: currentColor; }

.priority-badge {
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
}

.priority-low { color: var(--priority-low); }
.priority-medium { color: var(--priority-medium); }
.priority-high { color: var(--priority-high); }

/* Dates */
.due-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
}

.due-date.is-overdue {
  color: var(--priority-high);
  font-weight: 500;
}

/* Actions */
.action-btn {
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--primary);
}

.text-danger {
  color: var(--priority-high);
}

.text-muted {
  color: var(--text-muted);
}

/* Table Card */
.table-card .el-card__body {
  padding: 0 !important;
}

/* Drawer customization */
:deep(.el-drawer__header) {
  padding: var(--space-6);
  margin-bottom: 0;
  border-bottom: 1px solid var(--border-color);
  font-weight: var(--font-semibold);
}

:deep(.el-drawer__body) {
  padding: var(--space-6);
}

:deep(.el-drawer__footer) {
  padding: var(--space-6);
  border-top: 1px solid var(--border-color);
}

@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
