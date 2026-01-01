import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false
    }),

    actions: {
        async register(userData) {
            try {
                const config = useRuntimeConfig();
                const response = await $fetch(`${config.public.apiBase}/auth/register`, {
                    method: 'POST',
                    body: userData
                });

                this.user = response.user;
                this.token = response.token;
                this.isAuthenticated = true;

                // Store token and user in localStorage AND cookie
                if (process.client) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    // Set cookie that expires in 7 days
                    document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                }

                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Registration failed'
                };
            }
        },

        async login(credentials) {
            try {
                const config = useRuntimeConfig();
                const response = await $fetch(`${config.public.apiBase}/auth/login`, {
                    method: 'POST',
                    body: credentials
                });

                this.user = response.user;
                this.token = response.token;
                this.isAuthenticated = true;

                // Store token and user in localStorage AND cookie
                if (process.client) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    // Set cookie that expires in 7 days
                    document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                }

                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Login failed'
                };
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;

            if (process.client) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Clear the cookie
                document.cookie = 'token=; path=/; max-age=0';
            }

            navigateTo('/login');
        },

        // Initialize auth from localStorage
        initAuth() {
            if (process.client) {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                if (token) {
                    this.token = token;
                    this.isAuthenticated = true;
                    if (user) {
                        this.user = JSON.parse(user);
                    }
                }
            }
        }
    }
});
