<template>
  <div class="chat-page">
    <div class="chat-header">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
        How can I help you?
      </h1>
      <p class="text-gray-400">
        Ask me anything about your documents and policies
      </p>
    </div>

    <div class="messages-container">
      <div v-for="(msg, i) in messages" :key="i" class="message-wrapper">
        
        <div v-if="msg.role === 'User'" class="message-row user-row">
          <div class="message user-message">
            <p class="message-text">{{ msg.text }}</p>
          </div>
        </div>

        <div v-else-if="msg.role === 'AI'" class="message-row ai-row">
          <div class="message ai-message">
            <div class="ai-avatar"> 
              <img src="/EAKAP Logo.png" alt="EAKAP" class="w-8 h-6"/>
            </div>
            <div class="message-content">
              <p class="message-text">{{ msg.text }}</p>
              
              <div class="feedback">
                <button 
                  @click="sendFeedback(i, 'up')" 
                  :disabled="msg.feedbackSent || msg.feedbackLoading"
                  class="feedback-btn"
                  :class="{ 'feedback-sent': msg.feedbackSent }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
                </button>
                <button 
                  @click="sendFeedback(i, 'down')" 
                  :disabled="msg.feedbackSent || msg.feedbackLoading"
                  class="feedback-btn"
                  :class="{ 'feedback-sent': msg.feedbackSent }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                  </svg>
                </button>
                
                <span v-if="msg.feedbackLoading" class="feedback-status">Sending…</span>
                <span v-else-if="msg.feedbackSent" class="feedback-status feedback-success">Thank you!</span>
                <span v-else-if="msg.feedbackError" class="feedback-status feedback-error">Failed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="typing-indicator">
        <div class="message-row ai-row">
          <div class="message ai-message">
            <div class="ai-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-wrapper">
      <div class="input-container">
        <input 
          v-model="input" 
          placeholder="Ask about your documents..." 
          :disabled="loading" 
          @keydown.enter.prevent="send"
          class="chat-input"
        />
        <button 
          @click="send" 
          :disabled="loading || !input.trim()"
          class="send-button"
        >
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { accessToken, clearAuth } = useAuth()
const router = useRouter()

const input = ref('')
const messages = ref([
  { role: 'User', text: 'What is the leave policy?' },
  { role: 'AI', text: 'The leave policy allows 20 days annually.', feedbackSent: false, feedbackLoading: false, feedbackError: false }
])

const loading = ref(false)

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'User', text: text})
  input.value = ''

  loading.value = true
  try {
    const token = accessToken.value
    const data = await $fetch<{ answer: string }>('/api/chat', {
      method: 'POST',
      body: { query: text },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    messages.value.push({
      role: 'AI',
      text: data.answer,
      feedbackSent: false,
      feedbackLoading: false,
      feedbackError: false
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status === 401) {
      clearAuth()
      await router.push('/login')
      return
    }
    console.error(err)
    messages.value.push({
      role: 'AI',
      text: 'Error contacting server.',
      feedbackSent: false,
      feedbackLoading: false,
      feedbackError: false
    })
  } finally {
    loading.value = false
  }
}

async function sendFeedback(index, type) {
  const msg = messages.value[index]
  if (!msg || msg.role !== 'AI') return
  if (msg.feedbackSent || msg.feedbackLoading) return

  msg.feedbackError = false
  msg.feedbackLoading = true

  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        rating: type,
        text: msg.text,
        timestamp: Date.now()
      }
    })
    msg.feedbackSent = true
  } catch (e) {
    console.error(e)
    msg.feedbackError = true
  } finally {
    msg.feedbackLoading = false
  }
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
}

.chat-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.messages-container {
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-wrapper {
  width: 100%;
}

.message-row {
  display: flex;
  width: 100%;
  animation: fadeIn 0.3s ease-in;
}

.user-row {
  justify-content: flex-end;
}

.ai-row {
  justify-content: flex-start;
}

.message {
  max-width: 75%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-message {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.ai-message {
  background: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-bottom-left-radius: 0.25rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.ai-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.message-content {
  flex: 1;
}

.message-text {
  color: white;
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
}

.user-message .message-text {
  color: white;
}

.feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(71, 85, 105, 0.3);
}

.feedback-btn {
  background: rgba(71, 85, 105, 0.3);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.5rem;
  padding: 0.375rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-btn:hover:not(:disabled) {
  background: rgba(71, 85, 105, 0.5);
  color: white;
  border-color: rgba(71, 85, 105, 0.7);
}

.feedback-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback-btn.feedback-sent {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
  color: #10b981;
}

.feedback-status {
  font-size: 0.75rem;
  color: #9ca3af;
}

.feedback-success {
  color: #10b981;
}

.feedback-error {
  color: #ef4444;
}

.typing-indicator {
  animation: fadeIn 0.3s ease-in;
}

.typing-dots {
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0;
}

.typing-dots span {
  width: 0.5rem;
  height: 0.5rem;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.input-wrapper {
  max-width: 900px;
  width: 100%;
  padding: 0 1rem;
}

.input-container {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 1rem;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chat-input {
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.chat-input::placeholder {
  color: #6b7280;
}

.chat-input:focus {
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 768px) {
  .chat-page {
    padding: 1rem 0.5rem;
  }

  .message {
    max-width: 85%;
  }

  .chat-header h1 {
    font-size: 1.75rem;
  }
}
</style>