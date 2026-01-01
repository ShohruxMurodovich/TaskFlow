<template>
  <div class="task-comments">
    <h3 class="comments-title">Comments ({{ comments.length }})</h3>

    <!-- Comment List -->
    <div class="comments-list" v-loading="loading">
      <div v-if="comments.length === 0" class="no-comments">
        <p>No comments yet. Be the first to add one!</p>
      </div>

      <div v-for="comment in comments" :key="comment._id" class="comment-item">
        <el-avatar :size="32" class="comment-avatar">
          {{ getInitials(comment.user?.name) }}
        </el-avatar>
        
        <div class="comment-content">
          <div class="comment-header">
            <span class="user-name">{{ comment.user?.name || 'Unknown User' }}</span>
            <span class="time-ago">{{ formatTime(comment.createdAt) }}</span>
            
            <el-button 
              v-if="isOwner(comment)" 
              type="danger" 
              link 
              size="small" 
              class="delete-btn"
              @click="handleDelete(comment._id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          
          <div class="comment-text">{{ comment.content }}</div>
        </div>
      </div>
    </div>

    <!-- Add Comment -->
    <div class="add-comment">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="2"
        placeholder="Write a comment..."
        resize="none"
        @keydown.enter.prevent="submitComment"
      />
      <div class="comment-actions">
        <el-button 
          type="primary" 
          size="small" 
          :loading="submitting" 
          :disabled="!newComment.trim()"
          @click="submitComment"
        >
          Post Comment
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useCommentStore } from '~/stores/comments';
import { useAuthStore } from '~/stores/auth';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
});

const commentStore = useCommentStore();
const authStore = useAuthStore();

const newComment = ref('');
const submitting = ref(false);

const comments = computed(() => commentStore.comments[props.taskId] || []);
const loading = computed(() => commentStore.loading);

// Fetch on mount and watch for task change
const loadComments = () => {
  if (props.taskId) {
    commentStore.fetchComments(props.taskId);
  }
};

onMounted(() => {
  loadComments();
});

watch(() => props.taskId, () => {
  loadComments();
});

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  
  submitting.value = true;
  try {
    await commentStore.addComment(props.taskId, newComment.value);
    newComment.value = '';
  } catch (error) {
    console.error('Failed to post comment', error);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (commentId) => {
  try {
    await commentStore.deleteComment(commentId, props.taskId);
  } catch (error) {
    console.error('Failed to delete comment', error);
  }
};

const isOwner = (comment) => {
  // Check if current user is owner. 
  // Comment user might be object (populated) or string.
  const commentUserId = comment.user?._id || comment.user;
  return commentUserId === authStore.user?.id;
};

const getInitials = (name) => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
};

const formatTime = (date) => {
  return dayjs(date).fromNow();
};
</script>

<style scoped>
.task-comments {
  margin-top: 24px;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.comments-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.no-comments {
  color: var(--text-muted);
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-content {
  flex: 1;
  background: var(--bg-hover);
  padding: 10px 14px;
  border-radius: 8px;
  border-top-left-radius: 2px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.user-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
}

.time-ago {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: 8px;
}

.delete-btn {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s;
}

.comment-item:hover .delete-btn {
  opacity: 1;
}

.comment-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
}

.add-comment {
  margin-top: 16px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
