<template>
  <div class="auth-container">
    <div class="auth-content">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="brand-logo">

          <h1>TaskFlow</h1>
        </div>
        <h2>Welcome Back</h2>
        <p>Log in to manage your projects and tasks efficiently</p>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-form-wrapper">
        <el-card class="auth-card premium-card" shadow="always">
          <div class="auth-header">
            <h3>Sign In</h3>
            <p>Enter your credentials to access your account</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="loginForm.email"
                type="email"
                placeholder="you@example.com"
                size="large"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="Enter your password"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                native-type="submit"
                :loading="loading"
                size="large"
                style="width: 100%"
              >
                Sign In
              </el-button>
            </el-form-item>

            <div class="auth-footer">
              <span>Don't have an account?</span>
              <el-link type="primary" @click="navigateTo('/register')">
                Sign up now
              </el-link>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Management, Message, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
  layout: false
});

const authStore = useAuthStore();
const router = useRouter();

const loginFormRef = ref();
const loading = ref(false);

const loginForm = ref({
  email: '',
  password: ''
});

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  const valid = await loginFormRef.value.validate();
  if (!valid) return;

  loading.value = true;

  const result = await authStore.login(loginForm.value);

  if (result.success) {
    ElMessage.success({
      message: 'Welcome back!',
      type: 'success'
    });
    router.push('/');
  } else {
    ElMessage.error(result.message);
  }

  loading.value = false;
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-app);
  padding: var(--space-6);
}

.auth-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  width: 100%;
  max-width: 1100px;
  align-items: center;
}

.auth-branding {
  text-align: left;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.brand-logo h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.auth-branding h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
  line-height: var(--leading-tight);
}

.auth-branding p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 450px;
  justify-self: end;
}

.auth-card {
  padding: var(--space-8);
  border: 1px solid var(--border-color);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-header h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.auth-header p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-6);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.auth-footer span {
  margin-right: var(--space-2);
}

/* Form customization */
:deep(.el-form-item__label) {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

:deep(.el-input__wrapper) {
  padding: 12px 16px;
}

/* Responsive */
@media (max-width: 968px) {
  .auth-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .auth-branding {
    text-align: center;
  }

  .brand-logo {
    justify-content: center;
  }

  .auth-form-wrapper {
    justify-self: center;
  }
}
</style>
