<template>
  <NuxtPage />
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

// Initialize auth from localStorage on app mount
const authStore = useAuthStore();
onMounted(() => {
  authStore.initAuth();
});
</script>
