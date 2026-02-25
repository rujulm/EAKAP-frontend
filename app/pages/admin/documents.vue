<template>
    <div class="docs-page">

      <div class="page-header">
        <div>
          <h1 class="page-title">Documents</h1>
          <p class="page-subtitle">Upload and manage company documents</p>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">Upload Document</h2>
        <div class="upload-row">
          <label class="file-label">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
            <span>{{ file ? file.name : 'Choose file…' }}</span>
            <input type="file" ref="fileInput" @change="onFileChange" class="hidden-input" />
          </label>
          <button class="btn-primary" @click="upload" :disabled="!file || uploading">
            <svg v-if="!uploading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span class="loading-spinner" v-else></span>
            {{ uploading ? 'Uploading…' : 'Upload' }}
          </button>
        </div>
        <p v-if="uploadError" class="msg error-msg">{{ uploadError }}</p>
        <p v-if="uploadOk" class="msg success-msg">✓ Document uploaded successfully</p>
      </div>

      <div class="card">
        <h2 class="card-title">All Documents</h2>
        <p v-if="error" class="msg error-msg">{{ error }}</p>

        <div v-if="loading" class="loading-state">
          <span class="loading-spinner large"></span>
          <span>Loading documents…</span>
        </div>

        <table v-else-if="Array.isArray(docs) && docs.length" class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in docs" :key="d.id" class="table-row">
              <td class="doc-name">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="doc-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {{ d.name }}
              </td>
              <td class="doc-date">{{ formatTime(d.uploadedAt) }}</td>
              <td class="doc-actions">
                <button class="btn-delete" @click="remove(d.id)" :disabled="deletingId === d.id">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  {{ deletingId === d.id ? 'Deleting…' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="empty-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p>No documents uploaded yet</p>
        </div>
      </div>

    </div>
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
  return new Date(ts).toLocaleString()
}

async function load() {
  loading.value = true
  try {
    const data = await $fetch('/api/admin/documents')
    docs.value = data?.documents ?? data ?? []
  } catch (e) {
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
    await $fetch('/api/admin/documents/upload', { method: 'POST', body: form })
    uploadOk.value = true
    file.value = null
    await load()
    setTimeout(() => {
      uploadOk.value = false
      uploadError.value = ''
      if (fileInput.value) fileInput.value.value = ''
    }, 3000)
  } catch (e) {
    console.error(e)
    uploadError.value = 'Upload failed. Please try again.'
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


definePageMeta({ layout: 'admin' })
onMounted(load)
</script>

<style scoped>
.docs-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  padding: 2rem 1.5rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: #9ca3af;
  font-size: 0.87 rem;
  margin: 0;
}

.card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1.25rem 0;
}

.upload-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.file-label {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.62 rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file-label:hover {
  border-color: #3b82f6;
  color: #e2e8f0;
}

.file-label .icon {
  width: 1.12rem;
  height: 1.12rem;
  flex-shrink: 0;
}

.hidden-input {
  display: none;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: white;
  font-size: 0.87rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 0.87rem;
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-delete:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}


.msg {
  margin: 0.75rem 0 0 0;
  font-size: 0.875rem;
}

.error-msg { color: #f87171; }
.success-msg { color: #34d399; }


.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 0.75rem 0.75rem;
  border-bottom: 1px solid rgba(71, 85, 105, 0.4);
}

.table-row td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(71, 85, 105, 0.2);
  transition: background 0.15s;
}

.table-row:last-child td {
  border-bottom: none;
}

.table-row:hover td {
  background: rgba(71, 85, 105, 0.1);
}

.doc-name {
  color: #e2e8f0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doc-icon {
  width: 1rem;
  height: 1rem;
  color: #64748b;
  flex-shrink: 0;
}

.doc-date {
  color: #64748b;
  font-size: 0.8rem;
}

.doc-actions {
  text-align: right;
}


.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 0;
  color: #475569;
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

.loading-spinner.large {
  width: 1.5rem;
  height: 1.5rem;
  border-color: rgba(100, 116, 139, 0.3);
  border-top-color: #64748b;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .upload-row { flex-direction: column; }
  .btn-primary { width: 100%; justify-content: center; }
  .file-label { width: 100%; }
}
</style>