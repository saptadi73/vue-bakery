<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <form class="update-form" @submit.prevent="submitUpdate">
        <h3>Update Outlet</h3>
        <div class="form-group">
          <label>Nama Outlet</label>
          <input v-model="form.nama" type="text" required />
        </div>
        <div class="form-group">
          <label>Alamat (Opsional)</label>
          <input v-model="form.alamat" type="text" />
        </div>
        <div class="form-group">
          <label>Phone (Opsional)</label>
          <input v-model="form.phone" type="text" />
        </div>
        <div class="form-group">
          <label>Kode (Opsional)</label>
          <input v-model="form.kode" type="text" />
        </div>
        <div class="form-group">
          <label>Prioritas (Opsional)</label>
          <input v-model="form.prioritas" type="number" />
        </div>
        <div class="form-group">
          <label>Gambar (Opsional)</label>
          <input @change="onFileChange" type="file" accept="image/*" />
        </div>
        <div v-if="imagePreview" class="preview-group">
          <img :src="imagePreview" alt="Preview" class="preview-image" />
        </div>
        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal">Batal</button>
          <button type="submit" class="submit-btn">Update</button>
        </div>
        <div v-if="updateStatus" class="update-status">{{ updateStatus }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url.ts'

export default {
  name: 'UpdateOutletModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    outletId: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ['close', 'updated'],
  data() {
    return {
      form: {
        nama: '',
        alamat: '',
        phone: '',
        kode: '',
        prioritas: '',
        file: null,
      },
      imagePreview: '',
      updateStatus: '',
    }
  },
  watch: {
    outletId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchOutlet()
        }
      },
    },
  },
  methods: {
    async fetchOutlet() {
      try {
        const response = await api.get(`${BASE_URL}outlets/${this.outletId}`)
        const outlet = response.data.data
        this.form.nama = outlet.nama || ''
        this.form.alamat = outlet.alamat || ''
        this.form.phone = outlet.phone || ''
        this.form.kode = outlet.kode || ''
        this.form.prioritas = outlet.prioritas || ''
        this.imagePreview = outlet.gambar ? `${BASE_URL}${outlet.gambar}` : ''
      } catch (error) {
        console.error('Error fetching outlet:', error)
        this.updateStatus = 'Gagal memuat data outlet.'
      }
    },
    onFileChange(e) {
      const file = e.target.files[0]
      this.form.file = file
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.imagePreview = ev.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.imagePreview = ''
      }
    },
    async submitUpdate() {
      if (!this.form.nama) {
        this.updateStatus = 'Nama wajib diisi.'
        return
      }
      const formData = new FormData()
      formData.append('nama', this.form.nama)
      formData.append('alamat', this.form.alamat || '')
      formData.append('phone', this.form.phone || '')
      formData.append('kode', this.form.kode || '')
      formData.append('prioritas', this.form.prioritas ? this.form.prioritas.toString() : '')
      if (this.form.file) {
        formData.append('file', this.form.file)
      }
      // Debug FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }
      try {
        await api.post(`${BASE_URL}outlets/update/${this.outletId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.updateStatus = 'Update berhasil!'
        this.$emit('updated')
        setTimeout(() => {
          this.closeModal()
        }, 1000)
      } catch (error) {
        this.updateStatus = error.response?.data?.message || 'Update gagal!'
        console.error('Update error:', error)
      }
    },

    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        nama: '',
        alamat: '',
        phone: '',
        kode: '',
        prioritas: '',
        file: null,
      }
      this.imagePreview = ''
      this.updateStatus = ''
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
  position: relative;
}
.update-form {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px 18px 16px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  margin: 0 auto;
}
.update-form h3 {
  margin-bottom: 16px;
  font-size: 1.2em;
  font-weight: 600;
}
.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: 1em;
  font-weight: 500;
}
.form-group input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.preview-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}
.preview-image {
  max-width: 180px;
  max-height: 180px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-top: 6px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
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
.submit-btn {
  background: #ff9800;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #e65100;
}
.update-status {
  margin-top: 10px;
  color: #e65100;
  font-size: 0.98em;
}
</style>
