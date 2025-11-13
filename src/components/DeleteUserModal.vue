<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>Konfirmasi Hapus User</h3>
      <p>
        Apakah Anda yakin ingin menghapus user <strong>{{ userName }}</strong
        >?
      </p>
      <p class="warning-text">Tindakan ini tidak dapat dibatalkan.</p>
      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="closeModal">Batal</button>
        <button type="button" class="delete-btn" @click="confirmDelete">Hapus</button>
      </div>
      <div v-if="deleteStatus" class="delete-status">{{ deleteStatus }}</div>
    </div>
  </div>
</template>

<script>
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url.ts'

export default {
  name: 'DeleteUserModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: [String, Number],
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'deleted'],
  data() {
    return {
      deleteStatus: '',
    }
  },
  methods: {
    async confirmDelete() {
      try {
        await api.post(`${BASE_URL}user/delete/${this.userId}`)
        this.deleteStatus = 'User berhasil dihapus!'
        this.$emit('deleted')
        setTimeout(() => {
          this.closeModal()
        }, 1000)
      } catch (error) {
        this.deleteStatus = error.response?.data?.message || 'Gagal menghapus user!'
        console.error('Delete error:', error)
      }
    },
    closeModal() {
      this.$emit('close')
      this.deleteStatus = ''
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  padding: 28px 24px 18px 24px;
  min-width: 320px;
  max-width: 95vw;
  text-align: center;
}
.modal-content h3 {
  margin-bottom: 16px;
  font-size: 1.2em;
  font-weight: 600;
}
.modal-content p {
  margin-bottom: 12px;
  color: #555;
}
.warning-text {
  color: #d32f2f;
  font-weight: 500;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.cancel-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #ccc;
}
.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b71c1c;
}
.delete-status {
  margin-top: 10px;
  font-size: 0.98em;
}
</style>
