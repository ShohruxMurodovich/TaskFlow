<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <el-icon :size="28" color="#6366F1">
          <Management />
        </el-icon>
        <h2 class="sidebar-logo">TaskFlow</h2>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'is-active': isActive(item.path) }"
        >
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <el-avatar :size="36" class="user-avatar">
            {{ getUserInitials }}
          </el-avatar>
          <div class="user-details">
            <div class="user-name">{{ authStore.user?.name || 'User' }}</div>
            <div class="user-email">{{ authStore.user?.email }}</div>
          </div>
        </div>
        <el-button
          type="text"
          :icon="SwitchButton"
          class="logout-btn"
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-wrapper">
      <!-- Header -->
      <header class="app-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path" :to="crumb.path">
              {{ crumb.label }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-button
            type="text"
            :icon="isDark ? Sunny : Moon"
            class="theme-toggle-btn"
            @click="toggleDarkMode"
            :title="isDark ? 'Light Mode' : 'Dark Mode'"
            circle
          />
        </div>
      </header>

      <!-- Page Content -->
      <div class="app-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  Management,
  DataAnalysis,
  Folder,
  Document,
  SwitchButton,
  Moon,
  Sunny
} from '@element-plus/icons-vue';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

// Dark mode
const { isDark, toggle } = useDarkMode();
const toggleDarkMode = () => {
  toggle();
};

const menuItems = [
  { path: '/', icon: DataAnalysis, label: 'Dashboard' },
  { path: '/projects', icon: Folder, label: 'Projects' },
  { path: '/tasks', icon: Document, label: 'Tasks' }
];

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const breadcrumbs = computed(() => {
  const crumbs = [];
  const pathArray = route.path.split('/').filter(p => p);
  
  crumbs.push({ path: '/', label: 'Home' });
  
  let currentPath = '';
  pathArray.forEach(segment => {
    currentPath += `/${segment}`;
    const item = menuItems.find(m => m.path === currentPath);
    if (item) {
      crumbs.push({ path: currentPath, label: item.label });
    }
  });
  
  return crumbs;
});

const getUserInitials = computed(() => {
  const name = authStore.user?.name || 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const handleLogout = () => {
  ElMessageBox.confirm(
    'Are you sure you want to log out?',
    'Log Out',
    {
      confirmButtonText: 'Log Out',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    authStore.logout();
  });
};
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-app);
}

/* ========== Sidebar ========== */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  color: var(--text-white);
  position: fixed;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.sidebar-header {
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-white);
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-white);
}

.nav-item.is-active {
  background: rgba(99, 102, 241, 0.15);
  color: var(--text-white);
  border-left-color: #6366F1;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.user-avatar {
  background: var(--primary);
  color: white;
  font-weight: var(--font-semibold);
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.logout-btn:hover {
  color: var(--text-white);
}

.theme-toggle-btn {
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.theme-toggle-btn:hover {
  color: #FCD34D;
}

/* ========== Main Content ========== */
.main-wrapper {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-xs);
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-right .theme-toggle-btn {
  color: var(--text-secondary);
  width: 48px;
  height: 48px;
  font-size: 24px !important;
  transition: all 0.2s;
}

.header-right .theme-toggle-btn:hover {
  color: var(--primary);
  background: var(--bg-hover);
}

.app-content {
  flex: 1;
  overflow-y: auto;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-base);
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
  }

  .header-right {
    display: none;
  }
}
</style>
