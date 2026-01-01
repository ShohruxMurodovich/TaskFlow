<template>
  <NuxtLayout>
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Projects</h1>
          <p class="page-subtitle">{{ projectStore.projects.length }} active projects</p>
        </div>
        <div class="header-actions" style="display: flex; gap: 16px; align-items: center;">
          <el-input
            v-model="searchQuery"
            placeholder="Search projects..."
            :prefix-icon="Search"
            clearable
            style="width: 300px;"
          />
          <el-button type="primary" :icon="Plus" @click="openProjectDialog(null)">
            New Project
          </el-button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="projectStore.loading" class="projects-grid">
        <el-skeleton v-for="i in 4" :key="i" animated style="height: 200px;" />
      </div>

      <!-- Projects Grid -->
      <div v-else-if="filteredProjects.length > 0" class="projects-grid">
        <el-card
          v-for="project in filteredProjects"
          :key="project._id"
          class="project-card premium-card"
          shadow="never"
        >
          <div class="project-header">
            <h3 class="project-name">{{ project.name }}</h3>
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Edit" @click="openProjectDialog(project)">
                    Edit
                  </el-dropdown-item>
                  <el-dropdown-item :icon="Delete" @click="confirmDelete(project._id)">
                    Delete
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <p class="project-description">{{ project.description || 'No description provided' }}</p>

          <div class="project-meta">
            <div class="meta-item">
              <el-icon :size="16" color="var(--text-secondary)"><Calendar /></el-icon>
              <span>{{ formatDate(project.createdAt) }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- Empty State -->
      <el-empty v-else description="No projects yet">
        <el-button type="primary" :icon="Plus" @click="openProjectDialog(null)">
          Create First Project
        </el-button>
      </el-empty>

      <!-- Create/Edit Dialog -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? 'Edit Project' : 'New Project'"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="projectFormRef"
          :model="projectForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Project Name" prop="name">
            <el-input
              v-model="projectForm.name"
              placeholder="Enter project name..."
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Description">
            <el-input
              v-model="projectForm.description"
              type="textarea"
              :rows="4"
              placeholder="What is this project about?"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSave" :loading="saving">
            {{ isEdit ? 'Save Changes' : 'Create Project' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {
  Plus,
  Search,
  MoreFilled,
  Edit,
  Delete,
  Calendar
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  middleware: 'auth'
});

const projectStore = useProjectStore();

const dialogVisible = ref(false);
const saving = ref(false);
const isEdit = ref(false);
const currentProjectId = ref(null);
const searchQuery = ref('');

const projectFormRef = ref();
const projectForm = ref({
  name: '',
  description: ''
});

const rules = {
  name: [
    { required: true, message: 'Project name is required', trigger: 'blur' },
    { min: 3, message: 'Name must be at least 3 characters', trigger: 'blur' }
  ]
};

const filteredProjects = computed(() => {
  if (!searchQuery.value) {
    return projectStore.projects;
  }
  const query = searchQuery.value.toLowerCase();
  return projectStore.projects.filter(project =>
    project.name.toLowerCase().includes(query) ||
    (project.description && project.description.toLowerCase().includes(query))
  );
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const openProjectDialog = (project) => {
  if (project) {
    isEdit.value = true;
    currentProjectId.value = project._id;
    projectForm.value = {
      name: project.name,
      description: project.description || ''
    };
  } else {
    isEdit.value = false;
    currentProjectId.value = null;
    projectForm.value = {
      name: '',
      description: ''
    };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!projectFormRef.value) return;

  const valid = await projectFormRef.value.validate();
  if (!valid) return;

  saving.value = true;

  let result;
  if (isEdit.value) {
    result = await projectStore.updateProject(currentProjectId.value, projectForm.value);
  } else {
    result = await projectStore.createProject(projectForm.value);
  }

  if (result.success) {
    ElMessage.success({
      message: `Project ${isEdit.value ? 'updated' : 'created'} successfully`,
      type: 'success'
    });
    dialogVisible.value = false;
  } else {
    ElMessage.error(result.message);
  }

  saving.value = false;
};

const confirmDelete = (id) => {
  const project = projectStore.projects.find(p => p._id === id);
  ElMessageBox.confirm(
    `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
    'Delete Project',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(async () => {
    const result = await projectStore.deleteProject(id);
    if (result.success) {
      ElMessage.success('Project deleted successfully');
    } else {
      ElMessage.error(result.message);
    }
  }).catch(() => {
    // Cancelled
  });
};

onMounted(async () => {
  const result = await projectStore.fetchProjects();
  if (!result.success) {
    ElMessage.error(result.message);
  }
});
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.project-card {
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-hover);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.project-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-4) 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.project-meta {
  display: flex;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* Dialog customization */
:deep(.el-dialog) {
  border-radius: var(--radius-lg);
}

:deep(.el-dialog__header) {
  font-weight: var(--font-semibold);
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-dialog__body) {
  padding: var(--space-6);
}

:deep(.el-dialog__footer) {
  padding: var(--space-6);
  border-top: 1px solid var(--border-color);
}
</style>
