<template>
  <NuxtLayout>
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back! Here's your overview</p>
        </div>
        <el-button type="primary" :icon="Plus" @click="navigateTo('/tasks')">
          New Task
        </el-button>
      </div>

      <!-- Loading State -->
      <el-skeleton :loading="dashboardStore.loading" animated :rows="5" v-if="dashboardStore.loading" />

      <!-- Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="stats-grid" v-if="dashboardStore.stats">
          <el-card class="stat-card stat-todo premium-card" shadow="never">
            <div class="stat-icon">
              <el-icon :size="24"><Clock /></el-icon>
            </div>
            <div class="stat-label">To Do</div>
            <div class="stat-value">{{ dashboardStore.stats.byStatus.todo }}</div>
          </el-card>

          <el-card class="stat-card stat-progress premium-card" shadow="never">
            <div class="stat-icon">
              <el-icon :size="24"><Loading /></el-icon>
            </div>
            <div class="stat-label">In Progress</div>
            <div class="stat-value">{{ dashboardStore.stats.byStatus.inProgress }}</div>
          </el-card>

          <el-card class="stat-card stat-done premium-card" shadow="never">
            <div class="stat-icon">
              <el-icon :size="24"><CircleCheck /></el-icon>
            </div>
            <div class="stat-label">Done</div>
            <div class="stat-value">{{ dashboardStore.stats.byStatus.done }}</div>
          </el-card>

          <el-card class="stat-card stat-total premium-card" shadow="never">
            <div class="stat-icon">
              <el-icon :size="24"><Checked /></el-icon>
            </div>
            <div class="stat-label">Total Tasks</div>
            <div class="stat-value">{{ dashboardStore.stats.byStatus.total }}</div>
          </el-card>
        </div>

        <!-- Recent Tasks Section -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Recent Tasks</h2>
            <el-button type="primary" link @click="navigateTo('/tasks')">
              View All
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <el-card shadow="never" class="premium-card table-card">
            <el-table
              :data="dashboardStore.recentTasks"
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

              <el-table-column label="Due Date" width="160">
                <template #default="{ row }">
                  <div v-if="row.dueDate" class="due-date" :class="{ 'is-overdue': isOverdue(row.dueDate) }">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(row.dueDate) }}
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>
              </el-table-column>

              <template #empty>
                <el-empty description="No tasks yet">
                  <el-button type="primary" :icon="Plus" @click="navigateTo('/tasks')">
                    Create First Task
                  </el-button>
                </el-empty>
              </template>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {
  Plus,
  Clock,
  Loading,
  CircleCheck,
  Checked,
  ArrowRight,
  Calendar
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
  middleware: 'auth'
});

const dashboardStore = useDashboardStore();

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
    day: 'numeric'
  });
};

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

onMounted(async () => {
  const result = await dashboardStore.fetchDashboardData();
  if (!result.success) {
    ElMessage.error(result.message);
  }
});
</script>

<style scoped>
/* Scoped styles removed - layout handled by global classes in main.css */
</style>
