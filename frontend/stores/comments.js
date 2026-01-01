import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useCommentStore = defineStore('comments', {
    state: () => ({
        comments: {}, // Map taskId -> array of comments
        loading: false,
        error: null
    }),

    actions: {
        async fetchComments(taskId) {
            if (!taskId) return;

            this.loading = true;
            try {
                const config = useRuntimeConfig();
                const authStore = useAuthStore();

                const response = await axios.get(`${config.public.apiBase}/tasks/${taskId}/comments`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });

                this.comments[taskId] = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch comments';
            } finally {
                this.loading = false;
            }
        },

        async addComment(taskId, content) {
            if (!taskId || !content.trim()) return;

            try {
                const config = useRuntimeConfig();
                const authStore = useAuthStore();

                const response = await axios.post(`${config.public.apiBase}/tasks/${taskId}/comments`,
                    { content },
                    { headers: { Authorization: `Bearer ${authStore.token}` } }
                );

                // Optimistically add or let socket handle it? 
                // We'll add manually here, but duplicate check might be needed if socket also adds it.
                // Usually, if we have socket, we can rely on that, or push and avoid duplicate via ID.
                this.handleCommentCreated(response.data);

                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to add comment';
                throw error;
            }
        },

        async deleteComment(commentId, taskId) {
            try {
                const config = useRuntimeConfig();
                const authStore = useAuthStore();

                await axios.delete(`${config.public.apiBase}/comments/${commentId}`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });

                // Removal handled by socket or manual
                this.handleCommentDeleted(commentId, taskId);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete comment';
            }
        },

        // Socket Handlers
        handleCommentCreated(comment) {
            const taskId = comment.task;
            if (!this.comments[taskId]) {
                this.comments[taskId] = [];
            }

            // Check if exists to avoid duplicates (from optimistic UI or socket race)
            const exists = this.comments[taskId].find(c => c._id === comment._id);
            if (!exists) {
                this.comments[taskId].unshift(comment); // Add to top
            }
        },

        handleCommentDeleted(commentId, taskId) {
            // taskId passed from socket event or known context
            // If we don't know taskId (global delete), we might have to search all lists.
            // But typically we are viewing a task.

            // Ideally we should traverse or provided taskId is better.
            // For now, let's assume we search if taskId is missing, or we only care about open task.
            // In the simplified socket logic, we might just look in all keys.

            for (const tId in this.comments) {
                if (this.comments[tId]) {
                    this.comments[tId] = this.comments[tId].filter(c => c._id !== commentId);
                }
            }
        }
    }
});
