import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useProjectStore = defineStore('projects', {
    state: () => ({
        projects: [],
        loading: false,
        currentProject: null
    }),

    actions: {
        async fetchProjects() {
            this.loading = true;
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const response = await $fetch(`${config.public.apiBase}/projects`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });

                this.projects = response.data;
                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch projects'
                };
            } finally {
                this.loading = false;
            }
        },

        async createProject(projectData) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const response = await $fetch(`${config.public.apiBase}/projects`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: projectData
                });

                // Socket.io will handle adding to store
                return { success: true, data: response.data };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to create project'
                };
            }
        },

        async updateProject(id, projectData) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const response = await $fetch(`${config.public.apiBase}/projects/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: projectData
                });

                // Socket.io will handle updating store
                return { success: true, data: response.data };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to update project'
                };
            }
        },

        async deleteProject(id) {
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                await $fetch(`${config.public.apiBase}/projects/${id}`, {
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
                    message: error.data?.message || 'Failed to delete project'
                };
            }
        },

        // Real-time socket listeners
        initSocketListeners() {
            const socket = useSocket();

            // Project created event
            socket.on('project:created', (project) => {
                const exists = this.projects.find(p => p._id === project._id);
                if (!exists) {
                    this.projects.unshift(project);
                }
            });

            // Project updated event
            socket.on('project:updated', (project) => {
                const index = this.projects.findIndex(p => p._id === project._id);
                if (index !== -1) {
                    this.projects[index] = project;
                }
            });

            // Project deleted event
            socket.on('project:deleted', ({ id }) => {
                this.projects = this.projects.filter(p => p._id !== id);
            });
        }
    }
});
