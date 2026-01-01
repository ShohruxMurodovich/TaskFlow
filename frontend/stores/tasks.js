import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        loading: false,
        filters: {
            project: '',
            status: '',
            priority: ''
        }
    }),

    getters: {
        filteredTasks: (state) => {
            let filtered = state.tasks;

            if (state.filters.project) {
                filtered = filtered.filter(t => t.project._id === state.filters.project);
            }
            if (state.filters.status) {
                filtered = filtered.filter(t => t.status === state.filters.status);
            }
            if (state.filters.priority) {
                filtered = filtered.filter(t => t.priority === state.filters.priority);
            }

            return filtered;
        }
    },

    actions: {
        async fetchTasks(filters = {}) {
            this.loading = true;
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                // Build query string
                const params = new URLSearchParams();
                if (filters.project) params.append('project', filters.project);
                if (filters.status) params.append('status', filters.status);
                if (filters.priority) params.append('priority', filters.priority);

                const queryString = params.toString();
                const url = `${config.public.apiBase}/tasks${queryString ? '?' + queryString : ''}`;

                const response = await $fetch(url, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });

                this.tasks = response.data;
                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch tasks'
                };
            } finally {
                this.loading = false;
            }
        },

        async createTask(taskData) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const response = await $fetch(`${config.public.apiBase}/tasks`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: taskData
                });

                // Socket.io will handle adding to store
                return { success: true, data: response.data };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to create task'
                };
            }
        },

        async updateTask(id, taskData) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const response = await $fetch(`${config.public.apiBase}/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: taskData
                });

                // Socket.io will handle updating store
                return { success: true, data: response.data };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to update task'
                };
            }
        },

        async deleteTask(id) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                await $fetch(`${config.public.apiBase}/tasks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });

                // Socket.io will handle removing from store
                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to delete task'
                };
            }
        },

        setFilters(filters) {
            this.filters = { ...this.filters, ...filters };
        },

        clearFilters() {
            this.filters = {
                project: '',
                status: '',
                priority: ''
            };
        },

        // Real-time socket listeners
        initSocketListeners() {
            const socket = useSocket();

            // Task created event
            socket.on('task:created', (task) => {
                // Only add if not already in list (prevents duplicates)
                const exists = this.tasks.find(t => t._id === task._id);
                if (!exists) {
                    this.tasks.unshift(task);
                }
            });

            // Task updated event  
            socket.on('task:updated', (task) => {
                const index = this.tasks.findIndex(t => t._id === task._id);
                if (index !== -1) {
                    this.tasks[index] = task;
                }
            });

            // Task deleted event
            socket.on('task:deleted', ({ id }) => {
                this.tasks = this.tasks.filter(t => t._id !== id);
            });
        },

        disconnectSocket() {
            const { disconnectSocket } = useSocket();
            disconnectSocket();
        }
    }
});
