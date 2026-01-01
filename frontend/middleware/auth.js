export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // On server: check cookie, On client: check localStorage
    if (process.server) {
        // Read token from cookie on server-side
        const cookies = useCookie('token');
        if (cookies.value) {
            authStore.token = cookies.value;
            authStore.isAuthenticated = true;
        }
    } else if (process.client) {
        // Initialize from localStorage on client-side
        authStore.initAuth();
    }

    // Check if authenticated
    if (!authStore.isAuthenticated) {
        return navigateTo('/login');
    }
});
