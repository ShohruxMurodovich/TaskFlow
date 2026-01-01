// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error - defineNuxtConfig is auto-imported by Nuxt
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
            ]
        }
    },

    modules: [
        '@element-plus/nuxt',
        '@pinia/nuxt'
    ],

    css: ['~/assets/css/main.css'],

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5001/api'
        }
    },

    elementPlus: {
        importStyle: 'css',
        themes: ['dark']
    },

    nitro: {
        host: '0.0.0.0'
    }
})
