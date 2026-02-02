<template>
  <header>
    <h2>AI Assistant</h2>
    <div class="nav">
        <button>Profile</button>
        <button>Logout</button>
    </div>
  </header>
  <main>
    <h1>How can I help you?</h1>
    <div class="msg" v-for="(msg, i) in messages" :key="i">
      <div v-if="msg.role === 'AI'" class="AI">
      <p><strong>{{ msg.role }}:</strong> {{ msg.text }}</p>

      <div class="feedback">
        <button @click="sendFeedback(i, 'up')" :disabled="msg.feedbackSent || msg.feedbackLoading">👍</button>
        <button @click="sendFeedback(i, 'down')" :disabled="msg.feedbackSent || msg.feedbackLoading">👎</button>
        <span v-if="msg.feedbackLoading" class="feedback-status">Sending…</span>
        <span v-else-if="msg.feedbackSent" class="feedback-status">Thanks!</span>
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

  </main>
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

  messages.value.push({ role: 'User', text: text})
  input.value = ''

  loading.value = true
  try {
    const data = await $fetch('/api/chat', {
      method: 'POST',
      body: { query: text }
    })

    messages.value.push({ role: 'AI', text: data.answer, 
      feedbackSent: false,
      feedbackLoading: false,
      feedbackError: false })
  } catch (err) {
    console.error(err)
    messages.value.push({ role: 'AI', text: 'Error contacting server.', 
      feedbackSent: false,
      feedbackLoading: false,
      feedbackError: false })
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

<style>

h2 {
  color: white;
}

main {
  max-width: 800px;
  margin: 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 30px;
  background-color: rgb(81, 123, 170);
  padding: 10px;
}
.button-container {
  display: flex;
  justify-content: end;
}

main > div.msg {
  display: flex;
  width: 100%;
}

main > div:has(.AI) {
  justify-content: flex-start;
}

main > div:has(.User) {
  justify-content: flex-end;
}

p.User {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #cce5ff;
}
.AI {
  background: #eee;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
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
  font-family:Arial, Helvetica, sans-serif;
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
