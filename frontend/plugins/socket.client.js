export default defineNuxtPlugin({
    name: 'socket-init',
    enforce: 'post',
    setup() {
        // Initialize socket connection and listeners only on client side
        if (process.client) {
            const taskStore = useTaskStore();
            const projectStore = useProjectStore();

            // Initialize socket listeners for real-time updates
            taskStore.initSocketListeners();
            projectStore.initSocketListeners();

            console.log('✅ Real-time socket listeners initialized');
        }
    }
});
