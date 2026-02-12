<template>
  <div class="chat-page">
    <h1>How can I help you?</h1>
    <div class="msg" v-for="(msg, i) in messages" :key="i">
      <div v-if="msg.role === 'AI'" class="AI">
      <p><strong>{{ msg.role }}:</strong> {{ msg.text }}</p>

      <div class="feedback">
        <button @click="sendFeedback(i, 'up')" :disabled="msg.feedbackSent || msg.feedbackLoading">👍</button>
        <button @click="sendFeedback(i, 'down')" :disabled="msg.feedbackSent || msg.feedbackLoading">👎</button>
        <span v-if="msg.feedbackLoading" class="feedback-status">Sending…</span>
        <span v-else-if="msg.feedbackSent" class="feedback-status">Thank you!</span>
        <span v-else-if="msg.feedbackError" class="feedback-error">Failed</span>
      </div>
    </div>
      <p v-else-if="msg.role==='User'" class="User"><strong>{{ msg.role }}:</strong> {{ msg.text }}</p>
    </div>
    <p v-if="loading" class="typing">AI is typing…</p>
    <div id="input" class="input-container">
        <input v-model="input" placeholder="Enter your query" :disabled="loading" @keydown.enter.prevent="send"/>
        <button @click="send" :disabled="loading || !input.trim()">{{ loading ? 'Sending...' : 'Send' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([
  { role: 'User', text: 'What is the leave policy?' },
  { role: 'AI', text: 'The leave policy allows 20 days annually.' }
])

const loading = ref(false)

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'User', text })
  input.value = ''

  const aiMsg = {
    role: 'AI',
    text: '',
    feedbackSent: false,
    feedbackLoading: false,
    feedbackError: false
  }
  messages.value.push(aiMsg)

  loading.value = true
  try {
    const res = await fetch('/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: text })
    })

    if (!res.ok) {
      const errData = res.headers.get('content-type')?.includes('application/json')
        ? await res.json().catch(() => ({}))
        : await res.text()
      if (res.status === 401) {
        aiMsg.text = 'Please log in to use chat.'
      } else {
        aiMsg.text = typeof errData === 'string' ? errData : (errData?.message ?? 'Error contacting server.')
      }
      return
    }

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) {
      aiMsg.text = 'No response stream.'
      return
    }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const parsed = JSON.parse(payload)
            const chunk = typeof parsed === 'string' ? parsed : (parsed?.text ?? parsed?.delta ?? parsed?.content ?? '')
            if (chunk) aiMsg.text += chunk
          } catch {
            aiMsg.text += payload
          }
        }
      }
    }
    if (buffer.startsWith('data: ')) {
      const payload = buffer.slice(6)
      try {
        const parsed = JSON.parse(payload)
        const chunk = typeof parsed === 'string' ? parsed : (parsed?.text ?? parsed?.delta ?? parsed?.content ?? '')
        if (chunk) aiMsg.text += chunk
      } catch {
        aiMsg.text += payload
      }
    }
    if (!aiMsg.text) aiMsg.text = '(No content)'
  } catch (err) {
    console.error(err)
    aiMsg.text = 'Error contacting server.'
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
  color: #1a1a1a;
}

h1 {
  text-align: center;
  padding: 10px;
}
main > div.msg {
  display: flex;
}

.msg {
  display: flex;
  width: 100%;
  margin-top: 8px;
}

.msg:has(.AI) {
  justify-content: flex-start;
}

.msg:has(.User) {
  justify-content: flex-end;
}

p.User {
  padding: 8px 12px;
  border-radius: 12px;
  background: #cce5ff;
  color: #1a1a1a;
}

.AI {
  background: #eee;
  padding: 8px 12px;
  border-radius: 12px;
  color: #1a1a1a;
}

.AI p {
  margin: 0;
}

.input-container {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.input-container input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #ccc;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
}

.input-container input:focus {
  border-color: #888;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  margin: 2px;
  cursor: pointer;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback {
  margin-top: 6px;
  display: flex;
  align-items: center;
  font-size: 12px;
}

.feedback button {
  padding: 2px 3px;
  border-radius: 6px;
  font-size: 12px;
}

.feedback-status {
  opacity: 0.8;
}

.feedback-error {
  color: #b00020;
  font-weight: 600;
}

</style>

