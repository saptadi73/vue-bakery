<template>
  <div class="product-table-container">
    <div class="top-bar">
      <button v-if="roleId !== '2' && roleId !== '3'" class="add-btn" @click="showModal = true">
        + Add Product
      </button>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <form class="upload-form" @submit.prevent="submitUpload">
          <h3>Upload Produk Bakery</h3>
          <div class="form-group">
            <label>Nama Produk</label>
            <input v-model="uploadForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Kode Produk</label>
            <input v-model="uploadForm.code" type="text" required />
          </div>
          <div class="form-group">
            <label>Kategori</label>
            <select v-model="uploadForm.category_id" required>
              <option value="" disabled>Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.nama }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Foto Produk</label>
            <input @change="onFileChange" type="file" accept="image/*" required />
          </div>
          <div v-if="imagePreview" class="preview-group">
            <img :src="imagePreview" alt="Preview" class="preview-image" />
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showModal = false">Batal</button>
            <button type="submit" class="submit-btn">Upload</button>
          </div>
          <div v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</div>
        </form>
      </div>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari produk..." class="search-input" />
      <select v-model="selectedCategory" class="category-filter">
        <option value="">Semua Kategori</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.nama }}
        </option>
      </select>
    </div>
    <!-- Tabel untuk desktop -->
    <table class="product-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar</th>
          <th>Nama Produk</th>
          <th>Kode Produk</th>
          <th>Kategori</th>
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
                    : `${BASE_URL}uploads/products/default_cake.jpg`
                "
                :alt="product.nama"
                class="product-image"
              />
              <button class="edit-img-btn" @click.prevent="openEditImageModal(product)">✎</button>
            </div>
          </td>
          <td>{{ product.nama }}</td>
          <td>{{ product.kode }}</td>
          <td>{{ product.category ? product.category.nama : '' }}</td>
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
                : `${BASE_URL}uploads/products/default_cake.jpg`
            "
            :alt="product.name"
            class="product-image"
          />
          <button class="edit-img-btn" @click.prevent="openEditImageModal(product)">✎</button>
        </div>
        <div class="product-info">
          <div class="product-name">{{ product.nama }}</div>
          <div class="product-code">Kode: {{ product.kode }}</div>
          <div class="product-category">
            Kategori: {{ product.category ? product.category.nama : '' }}
          </div>
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
          <h3>Edit Foto Produk {{ produk_id }} - {{ produk_name }}</h3>
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
    <update-product-modal
      :show="showUpdateModal"
      :product-id="updateProductId"
      @close="closeUpdateModal"
      @updated="onProductUpdated"
    />
    <delete-product-modal
      :show="showDeleteModal"
      :product-id="deleteProductId"
      :product-name="deleteProductName"
      @close="closeDeleteModal"
      @deleted="onProductDeleted"
    />
    <loading-overlay />
    <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:close="tutupToast" />
  </div>
</template>

<script>
// ...existing code...
import axios from 'axios'
import api from '@/user/axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import UpdateProductModal from '@/components/UpdateProductModal.vue'
import DeleteProductModal from '@/components/DeleteProductModal.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '@/components/ToastCard.vue'

export default {
  name: 'TableDaftarProductBakery',
  components: { LoadingOverlay, UpdateProductModal, DeleteProductModal, ToastCard },
  data() {
    return {
      showToast: false,
      message_toast: '',
      BASE_URL,
      produk_id: null,
      produk_name: '',
      searchQuery: '',
      products: [],
      orderQuantities: {},
      orderDates: {},
      orderStatus: {},
      isMobile: false,
      uploadForm: {
        name: '',
        code: '',
        category_id: '',
        file: null,
      },
      categories: [],
      uploadStatus: '',
      showModal: false,
      imagePreview: '',
      showEditImageModal: false,
      editImageProduct: null,
      editImageFile: null,
      editImagePreview: '',
      editImageStatus: '',
      showUpdateModal: false,
      updateProductId: null,
      selectedCategory: '',
      showDeleteModal: false,
      deleteProductId: null,
      deleteProductName: '',
      roleId: localStorage.getItem('role_id'),
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  methods: {
    tutupToast() {
      this.showToast = true
      window.location.reload()
    },
    async getProducts() {
      try {
        this.loadingStore.show()
        // Ganti URL berikut dengan endpoint backend Anda
        const response = await axios.get(`${BASE_URL}products`)
        this.products = response.data.data
        console.log('Fetched products:', this.products)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getCategories() {
      try {
        const response = await api.get(`${BASE_URL}categories`)
        this.categories = response.data.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    editProduct(product) {
      this.updateProductId = product.id
      this.showUpdateModal = true
    },
    deleteProduct(product) {
      this.deleteProductId = product.id
      this.deleteProductName = product.nama || product.name
      this.showDeleteModal = true
    },
    openEditImageModal(product) {
      this.produk_id = product.id
      this.produk_name = product.nama
      this.editImageProduct = product.id
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
      this.produk_name = ''
    },
    closeUpdateModal() {
      this.showUpdateModal = false
      this.updateProductId = null
    },
    onProductUpdated() {
      this.getProducts()
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteProductId = null
      this.deleteProductName = ''
    },
    onProductDeleted() {
      this.getProducts()
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
          `${BASE_URL}products/update/image/${this.produk_id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )
        console.log('Image update response:', response.data)
        // Update local product data
        const updatedProduct = response.data.data
        const index = this.products.findIndex((p) => p.id === updatedProduct.id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        this.editImageStatus = response.data.message || 'Update berhasil!'
        setTimeout(() => {
          this.closeEditImageModal()
        }, 1000)
      } catch (err) {
        this.editImageStatus = err.message || 'Update gagal!'
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
      this.uploadForm.file = file
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
      if (
        !this.uploadForm.name ||
        !this.uploadForm.code ||
        !this.uploadForm.category_id ||
        !this.uploadForm.file
      ) {
        this.uploadStatus = 'Semua field wajib diisi.'
        return
      }
      const formData = new FormData()
      formData.append('nama', this.uploadForm.name)
      formData.append('kode', this.uploadForm.code)
      formData.append('category_id', this.uploadForm.category_id)
      formData.append('file', this.uploadForm.file)
      try {
        // Ganti URL berikut dengan endpoint backend Anda
        const response = await api.post('products/new', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.showToast = true
        this.message_toast = response.data.message
        this.uploadStatus = response.data.message || 'Upload berhasil!'
        this.products.push(response.data.data)
        // Reset form
        this.uploadForm = { name: '', code: '', category_id: '', file: null }
        setTimeout(() => {
          this.uploadStatus = ''
          this.showModal = false
          this.imagePreview = ''
        }, 1200)
      } catch (err) {
        this.uploadStatus = err.message || 'Upload gagal!'
        this.imagePreview = ''
      }
    },
  },
  created() {
    this.getProducts()
    this.getCategories()
  },
  computed: {
    filteredProducts() {
      let filtered = this.products
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            (p.nama && p.nama.toLowerCase().includes(q)) ||
            (p.kode && p.kode.toLowerCase().includes(q)),
        )
      }
      if (this.selectedCategory) {
        filtered = filtered.filter((p) => p.category_id == this.selectedCategory)
      }
      return filtered
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
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 220px;
}
.category-filter {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 150px;
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
.product-category {
  color: #666;
  font-size: 0.9em;
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
