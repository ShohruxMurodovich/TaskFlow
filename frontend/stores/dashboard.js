import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        stats: null,
        recentTasks: [],
        loading: false
    }),

    actions: {
        async fetchDashboardData() {
            this.loading = true;
            try {
                const authStore = useAuthStore();
                const config = useRuntimeConfig();

                const [statsResponse, tasksResponse] = await Promise.all([
                    $fetch(`${config.public.apiBase}/dashboard/stats`, {
                        headers: { Authorization: `Bearer ${authStore.token}` }
                    }),
                    $fetch(`${config.public.apiBase}/dashboard/recent`, {
                        headers: { Authorization: `Bearer ${authStore.token}` }
                    })
                ]);

                this.stats = statsResponse.data;
                this.recentTasks = tasksResponse.data;

                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Failed to fetch dashboard data'
                };
            } finally {
                this.loading = false;
            }
        }
    }
});
