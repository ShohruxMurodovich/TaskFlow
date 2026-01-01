<template>
  <div class="auth-container">
    <div class="auth-content">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="brand-logo">
          <el-icon :size="48" color="#6366F1">
            <Management />
          </el-icon>
          <h1>TaskFlow</h1>
        </div>
        <h2>Start Your Journey</h2>
        <p>Create an account and begin managing your projects like a pro</p>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-form-wrapper">
        <el-card class="auth-card premium-card" shadow="always">
          <div class="auth-header">
            <h3>Create Account</h3>
            <p>Fill in your details to get started</p>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleRegister"
          >
            <el-form-item label="Full Name" prop="name">
              <el-input
                v-model="registerForm.name"
                placeholder="John Doe"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input
                v-model="registerForm.email"
                type="email"
                placeholder="you@example.com"
                size="large"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="At least 6 characters"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="Repeat your password"
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
                Create Account
              </el-button>
            </el-form-item>

            <div class="auth-footer">
              <span>Already have an account?</span>
              <el-link type="primary" @click="navigateTo('/login')">
                Sign in instead
              </el-link>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Management, User, Message, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
  layout: false
});

const authStore = useAuthStore();
const router = useRouter();

const registerFormRef = ref();
const loading = ref(false);

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please confirm your password'));
  } else if (value !== registerForm.value.password) {
    callback(new Error('Passwords do not match'));
  } else {
    callback();
  }
};

const rules = {
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 2, message: 'Name must be at least 2 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ]
};

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  const valid = await registerFormRef.value.validate();
  if (!valid) return;

  loading.value = true;

  const result = await authStore.register({
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password
  });

  if (result.success) {
    ElMessage.success({
      message: 'Account created successfully!',
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
