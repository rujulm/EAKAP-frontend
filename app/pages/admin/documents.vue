<template>
  <header>
    <h2>AI Assistant</h2>
    <div class="nav">
        <button>Profile</button>
        <button>Logout</button>
    </div>
  </header>
  <main class="wrap">
    
    <h1>Manage Documents</h1>

    <section class="card">
      <h2>Upload document</h2>
      <div class="row">
        <input type="file" ref="fileInput" @change="onFileChange" />
        <button @click="upload" :disabled="!file || uploading">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
      <p v-if="uploadError" class="error">{{ uploadError }}</p>
      <p v-if="uploadOk" class="ok">Uploaded!</p>
    </section>

    <section class="card">
      <h2>Documents</h2>
      <p v-if="error" class="error">{{ error }}</p>

      <table v-if="Array.isArray(docs) && docs.length" class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploaded</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in docs" :key="d.id">
            <td>{{ d.name }}</td>
            <td>{{ formatTime(d.uploadedAt) }}</td>
            <td class="right">
              <button class="danger" @click="remove(d.id)" :disabled="deletingId === d.id">
                {{ deletingId === d.id ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="muted">No documents yet.</p>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const docs = ref([])
const loading = ref(false)
const error = ref('')

const fileInput = ref(null)
const file = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadOk = ref(false)

const deletingId = ref(null)

function onFileChange(e) {
  uploadOk.value = false
  uploadError.value = ''
  file.value = e.target.files?.[0] || null
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ''
  }
}

async function load() {
  error.value = ''
  loading.value = true
  try {
    const data = await $fetch('/api/admin/documents')
    const documents =
      Array.isArray(data) ? data
      : Array.isArray(data?.documents) ? data.documents
      : []
    docs.value = documents
  } catch (e) {
    console.error(e)
    docs.value = []
    error.value = 'Failed to load documents.'
  } finally {
    loading.value = false
  }
}

async function upload() {
  if (!file.value || uploading.value) return
  uploadOk.value = false
  uploadError.value = ''
  uploading.value = true

  try {
    const form = new FormData()
    form.append('file', file.value)

    await $fetch('/api/admin/documents/upload', {
      method: 'POST',
      body: form
    })

    uploadOk.value = true
    file.value = ''
    await load()
    setTimeout(() => {
    uploadOk.value = false
    uploadError.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''   // clears the file chooser visually
    }
    }, 3000)
  } catch (e) {
    console.error(e)
    uploadError.value = 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function remove(id) {
  if (deletingId.value) return
  deletingId.value = id
  try {
    await $fetch(`/api/admin/documents/${id}`, { method: 'DELETE' })
    await load()

  } catch (e) {
    console.error(e)
    error.value = 'Delete failed.'
  } finally {
    deletingId.value = null
  }
}

onMounted(load)
</script>

<style>
.wrap {
  max-width: 900px;
  margin: 1rem auto;
  padding: 0 12px;
  font-family: Arial, Helvetica, sans-serif;
  color: #111;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 30px;
  background-color: rgb(81, 123, 170);
  color: white;
  padding: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

.card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
  background: #fff;
}
.wrap h1 {
    text-align: center;
}
.row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th, .table td {
  border-bottom: 1px solid #eee;
  padding: 10px 8px;
  text-align: left;
}

.right { text-align: right; }

button {
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  margin: 2px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.danger {
  background: #ffd6d6;
}

.error { color: #b00020; margin-top: 8px; }
.ok {
  color: #1b7f2a;
  margin-top: 8px;
  transition: opacity 0.4s ease;
}
.muted { opacity: 0.7; margin-top: 10px; }
</style>
