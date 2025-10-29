<template>
  <div class="product-table-container">
    <div class="top-bar">
      <button v-if="roleId !== '2' && roleId !== '3'" class="add-btn" @click="showModal = true">
        + Add Outlet
      </button>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <form class="upload-form" @submit.prevent="submitUpload">
          <h3>Tambah Outlet Baru</h3>
          <div class="form-group">
            <label>Nama Outlet</label>
            <input v-model="uploadForm.nama" type="text" required />
          </div>
          <div class="form-group">
            <label>Alamat</label>
            <input v-model="uploadForm.alamat" type="text" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="uploadForm.phone" type="text" />
          </div>
          <div class="form-group">
            <label>Kode (Opsional)</label>
            <input v-model="uploadForm.kode" type="text" />
          </div>
          <div class="form-group">
            <label>Prioritas (Opsional)</label>
            <input v-model="uploadForm.prioritas" type="number" />
          </div>
          <div class="form-group">
            <label>Gambar (Opsional)</label>
            <input @change="onFileChange" type="file" accept="image/*" />
          </div>
          <div v-if="imagePreview" class="preview-group">
            <img :src="imagePreview" alt="Preview" class="preview-image" />
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showModal = false">Batal</button>
            <button type="submit" class="submit-btn">Tambah</button>
          </div>
          <div v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</div>
        </form>
      </div>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari produk..." class="search-input" />
    </div>
    <!-- Tabel untuk desktop -->
    <table class="product-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar</th>
          <th>Nama Outlet</th>
          <th>Alamat</th>
          <th>Telp</th>
          <th>Kode</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td class="img-edit-cell">
            <div class="img-edit-wrapper">
              <img
                :src="
                  product.gambar
                    ? `${BASE_URL}${product.gambar}`
                    : `${BASE_URL}uploads/outlets/outlet_default.jpg`
                "
                :alt="product.nama"
                class="product-image"
              />
              <button class="edit-img-btn" @click.prevent="openEditImageModal(product)">✎</button>
            </div>
          </td>
          <td>{{ product.nama }}</td>

          <td>{{ product.alamat }}</td>
          <td>{{ product.phone }}</td>
          <td>{{ product.kode }}</td>

          <td class="aksi-cell">
            <button
              v-if="roleId !== '2' && roleId !== '3'"
              class="icon-btn"
              @click="editProduct(product)"
              title="Edit"
            >
              <span class="icon-edit" aria-label="Edit">✏️</span>
            </button>
            <button
              v-if="roleId !== '2' && roleId !== '3'"
              class="icon-btn"
              @click="deleteProduct(product)"
              title="Delete"
            >
              <span class="icon-delete" aria-label="Delete">🗑️</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="product-card-list" v-else>
      <div class="product-card" v-for="product in filteredProducts" :key="product.id">
        <div class="img-edit-wrapper">
          <img
            :src="
              product.gambar
                ? `${BASE_URL}${product.gambar}`
                : `${BASE_URL}uploads/outlets/outlet_default.jpg`
            "
            :alt="product.name"
            class="product-image"
          />
          <button class="edit-img-btn" @click.prevent="openEditImageModal(product)">✎</button>
        </div>
        <div class="product-info">
          <div class="product-name">{{ product.nama }}</div>
          <div class="product-code">Kode: {{ product.kode }}</div>
          <div class="product-code">Alamat: {{ product.alamat }}</div>
          <div class="product-code">Telp: {{ product.phone }}</div>
          <div class="product-order">
            <button
              v-if="roleId !== '2' && roleId !== '3'"
              class="icon-btn"
              @click="editProduct(product)"
              title="Edit"
            >
              <span class="icon-edit" aria-label="Edit">✏️</span>
            </button>
            <button
              v-if="roleId !== '2' && roleId !== '3'"
              class="icon-btn"
              @click="deleteProduct(product)"
              title="Delete"
            >
              <span class="icon-delete" aria-label="Delete">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit Gambar Produk (hanya satu, di luar v-for) -->
    <div v-if="showEditImageModal" class="modal-overlay" @click.self="closeEditImageModal">
      <div class="modal-content">
        <form class="upload-form" @submit.prevent="submitEditImage">
          <h3>Edit Foto Outlet {{ produk_id }} - {{ outlet_name }}</h3>
          <div class="form-group">
            <label>Foto Baru</label>
            <input @change="onEditImageFileChange" type="file" accept="image/*" required />
          </div>
          <div v-if="editImagePreview" class="preview-group">
            <img :src="editImagePreview" alt="Preview" class="preview-image" />
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeEditImageModal">Batal</button>
            <button type="submit" class="submit-btn" @click="submitEditImage">Update</button>
          </div>
          <div v-if="editImageStatus" class="upload-status">{{ editImageStatus }}</div>
        </form>
      </div>
    </div>
    <UpdateOutletModal
      v-if="updateOutletId"
      :show="showUpdateModal"
      :outlet-id="updateOutletId"
      @close="closeUpdateModal"
      @updated="onOutletUpdated"
    />
    <DeleteOutletModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :outlet-id="deleteOutletId"
      :outlet-name="deleteOutletName"
      @close="closeDeleteModal"
      @deleted="onOutletDeleted"
    />
    <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:close="tutupToast" />
    <loading-overlay />
  </div>
</template>

<script>
// ...existing code...
import axios from 'axios'
import api from '@/user/axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import UpdateOutletModal from '@/components/UpdateOutletModal.vue'
import DeleteOutletModal from '@/components/DeleteOutletModal.vue'
import ToastCard from '@/components/ToastCard.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  name: 'TableDaftarProductBakery',
  components: { LoadingOverlay, UpdateOutletModal, DeleteOutletModal, ToastCard },
  data() {
    return {
      BASE_URL,
      produk_id: null,
      outlet_name: '',
      searchQuery: '',
      products: [],
      orderQuantities: {},
      orderDates: {},
      orderStatus: {},
      isMobile: false,
      uploadForm: {
        nama: '',
        alamat: '',
        phone: '',
        kode: '',
        prioritas: '',
        gambar: null,
      },
      uploadStatus: '',
      showModal: false,
      imagePreview: '',
      showEditImageModal: false,
      editImageProduct: null,
      editImageFile: null,
      editImagePreview: '',
      editImageStatus: '',
      showUpdateModal: false,
      updateOutletId: null,
      showDeleteModal: false,
      deleteOutletId: null,
      deleteOutletName: '',
      toastMessage: '',
      showToast: false,
      roleId: localStorage.getItem('role_id'),
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  methods: {
    async getProducts() {
      try {
        this.loadingStore.show()
        // Ganti URL berikut dengan endpoint backend Anda
        const response = await axios.get(`${BASE_URL}outlets/all`)
        this.products = response.data.data
        console.log('Fetched outlets:', this.products)
      } catch (err) {
        console.error('Error fetching oulets:', err)
      } finally {
        this.loadingStore.hide()
      }
    },
    editProduct(product) {
      this.updateOutletId = product.id
      this.showUpdateModal = true
    },
    closeUpdateModal() {
      this.showUpdateModal = false
      this.updateOutletId = null
    },
    onOutletUpdated() {
      this.getProducts()
      this.showToast = true
      this.toastMessage = 'Outlet berhasil diupdate!'
    },
    tutupToast() {
      this.showToast = false
    },
    deleteProduct(product) {
      this.deleteOutletId = product.id
      this.deleteOutletName = product.nama
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteOutletId = null
      this.deleteOutletName = ''
    },
    onOutletDeleted() {
      this.getProducts()
      this.showToast = true
      this.toastMessage = 'Outlet berhasil dihapus!'
    },
    openEditImageModal(outlet) {
      this.produk_id = outlet.id
      this.outlet_name = outlet.nama
      this.editImageProduct = outlet
      this.showEditImageModal = true
      this.editImageFile = null
      this.editImagePreview = ''
      this.editImageStatus = ''
    },
    closeEditImageModal() {
      this.showEditImageModal = false
      this.editImageProduct = null
      this.editImageFile = null
      this.editImagePreview = ''
      this.editImageStatus = ''
      this.produk_id = null
      this.outlet_name = ''
    },
    onEditImageFileChange(e) {
      const file = e.target.files[0]
      this.editImageFile = file
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.editImagePreview = ev.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.editImagePreview = ''
      }
    },
    async submitEditImage() {
      if (!this.editImageFile || !this.editImageProduct) {
        this.editImageStatus = 'Pilih gambar baru.'
        return
      }
      const formData = new FormData()
      formData.append('file', this.editImageFile)
      this.loadingStore.show()
      try {
        const response = await api.post(
          `${BASE_URL}outlets/update/image/${this.editImageProduct.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )
        console.log('Image update response:', response.data)
        // Update local array
        const index = this.products.findIndex((p) => p.id === this.editImageProduct.id)
        if (index !== -1) {
          this.products[index] = response.data.data
        }
        this.editImageStatus = 'Update berhasil!'
        this.showToast = true
        this.toastMessage = 'Gambar outlet berhasil diupdate!'
        setTimeout(() => {
          this.closeEditImageModal()
        }, 1000)
      } catch (err) {
        console.error('Update image error:', err)
        this.editImageStatus = err.response?.data?.message || 'Update gagal!'
      } finally {
        this.loadingStore.hide()
      }
    },
    submitOrder(product) {
      const qty = this.orderQuantities[product.code] || 0
      if (qty < 1) {
        alert('Masukkan jumlah order yang valid!')
        return
      }
      alert(`Order untuk ${product.name} (${product.code}) sebanyak ${qty} berhasil disubmit!`)
      this.orderQuantities[product.code] = 1
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 600
    },
    onFileChange(e) {
      const file = e.target.files[0]
      this.uploadForm.gambar = file
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
    async submitUpload() {
      if (!this.uploadForm.nama) {
        this.uploadStatus = 'Nama wajib diisi.'
        return
      }
      const formData = new FormData()
      formData.append('nama', this.uploadForm.nama)
      formData.append('alamat', this.uploadForm.alamat)
      formData.append('phone', this.uploadForm.phone)
      formData.append('kode', this.uploadForm.kode)
      formData.append('prioritas', this.uploadForm.prioritas)
      formData.append('file', this.uploadForm.gambar)
      try {
        // Ganti URL berikut dengan endpoint backend Anda
        const response = await api.post(`${BASE_URL}outlets/new`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.uploadStatus = response.data.message || 'Tambah berhasil!'
        this.products.push(response.data.data)
        this.showToast = true
        this.toastMessage = 'Outlet berhasil ditambahkan!'
        // Reset form
        this.uploadForm = { nama: '', alamat: '', phone: '', kode: '', prioritas: '', gambar: null }
        setTimeout(() => {
          this.uploadStatus = ''
          this.showModal = false
          this.imagePreview = ''
        }, 1200)
      } catch (err) {
        this.uploadStatus = err.message || 'Tambah gagal!'
        this.imagePreview = ''
      }
    },
  },
  created() {
    this.getProducts()
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products
      const q = this.searchQuery.toLowerCase()
      return this.products.filter(
        (p) => p.nama.toLowerCase().includes(q) || p.kode.toLowerCase().includes(q),
      )
    },
  },
  // ...existing code...
  mounted() {
    // Inisialisasi quantity default
    const today = new Date().toISOString().slice(0, 10)
    this.products.forEach((p) => {
      this.orderQuantities[p.code] = 1
      this.orderDates[p.code] = today
      this.orderStatus[p.code] = 'Open'
    })
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.aksi-cell {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}
.icon-btn {
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background 0.18s;
  margin-left: 2px;
}
.icon-btn:hover {
  background: #f5f5f5;
}
.icon-edit {
  color: #1976d2;
}
.icon-delete {
  color: #d32f2f;
}
.status-text {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 0.98em;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.status-ordered {
  background: #e8f5e9;
  color: #388e3c;
  border: 1px solid #a5d6a7;
}
.status-open {
  background: #fffde7;
  color: #fbc02d;
  border: 1px solid #ffe082;
}
.date-input {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
  width: 140px;
}
.product-date {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.date-label {
  font-size: 0.98em;
  color: #666;
}
.img-edit-cell {
  position: relative;
}
.img-edit-wrapper {
  position: relative;
  display: inline-block;
}
.edit-img-btn {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: background 0.2s;
  z-index: 2;
}
.edit-img-btn:hover {
  background: #ffe0b2;
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
.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}
.add-btn {
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #2e7031;
}
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
.product-table-container {
  max-width: 900px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.upload-form {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px 18px 16px 18px;
  margin-bottom: 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.upload-form h3 {
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
.upload-status {
  margin-top: 10px;
  color: #e65100;
  font-size: 0.98em;
}
.search-bar {
  margin-bottom: 16px;
  text-align: right;
}
.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 220px;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
.qty-input {
  width: 60px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: center;
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

/* Card style for mobile */
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.product-card {
  display: flex;
  align-items: center;
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 16px;
  gap: 16px;
}
.product-card .product-image {
  width: 64px;
  height: 64px;
  margin-right: 12px;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.product-name {
  font-size: 1.1em;
  font-weight: 600;
}
.product-code {
  color: #888;
  font-size: 0.95em;
}
.product-order {
  display: flex;
  align-items: center;
  gap: 8px;
}
@media (max-width: 600px) {
  .product-table {
    display: none;
  }
  .product-card-list {
    display: flex;
  }
}
@media (min-width: 601px) {
  .product-card-list {
    display: none;
  }
}
</style>
