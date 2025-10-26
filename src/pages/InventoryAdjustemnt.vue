<template>
  <div class="p-6 space-y-6">
    <!-- Form Header -->
    <div class="flex justify-center items-center mb-8">
      <h1 class="text-4xl font-semibold text-gray-800 font-montserrat">
        Inventory Adjustment Form
      </h1>
    </div>

    <!-- Inventory Adjustment Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <!-- Product Name Input -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
          <label for="productName" class="block text-sm font-medium text-gray-700 mb-2"
            >Nama Produk</label
          >
          <input
            v-model="productNameQuery"
            @input="onProductNameInput"
            type="text"
            id="productName"
            placeholder="Ketik nama produk..."
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <input v-model="formData.product_id" type="hidden" />
          <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
            <li
              v-for="product in suggestions"
              :key="product.id"
              @click="selectProduct(product)"
              class="suggestion-item"
            >
              {{ product.nama }} - {{ product.category ? product.category.nama : 'No Category' }}
            </li>
          </ul>
        </div>
        <!-- Category -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2"
            >Kategori</label
          >
          <input
            v-model="categoryQuery"
            @input="onCategoryInput"
            type="text"
            id="category"
            placeholder="Ketik nama kategori..."
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <!-- Quantity Tercatat di Sistem -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="systemQuantity" class="block text-sm font-medium text-gray-700 mb-2"
            >Quantity Tercatat di Sistem</label
          >
          <input
            v-model="formData.systemQuantity"
            id="systemQuantity"
            type="number"
            min="0"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Quantity Tercatat"
            readonly
            required
          />
        </div>
        <!-- Quantity Terhitung Manual -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="manualQuantity" class="block text-sm font-medium text-gray-700 mb-2"
            >Quantity Terhitung Manual</label
          >
          <input
            v-model="formData.manualQuantity"
            id="manualQuantity"
            type="number"
            min="0"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Quantity Manual"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
        <!-- Outlet -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
          <label for="outlet" class="block text-sm font-medium text-gray-700 mb-2">Outlet</label>
          <input
            v-model="outletQuery"
            @input="onOutletInput"
            type="text"
            id="outlet"
            placeholder="Ketik nama outlet..."
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <ul v-if="showOutletSuggestions && outletSuggestions.length" class="suggestions-list">
            <li
              v-for="outlet in outletSuggestions"
              :key="outlet.id"
              @click="selectOutlet(outlet)"
              class="suggestion-item"
            >
              {{ outlet.nama }}
            </li>
          </ul>
        </div>

        <!-- Type -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="formData.type"
            id="type"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled>Pilih Type</option>
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </div>
        <!-- Keterangan -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="keterangan" class="block text-sm font-medium text-gray-700 mb-2"
            >Keterangan</label
          >
          <input
            v-model="formData.keterangan"
            id="keterangan"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Keterangan"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Submit
        </button>
      </div>
    </form>
    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import api from '@/user/axios.js'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading.js'

export default {
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      formData: {
        product_id: '',
        category_id: '',
        outlet_id: '',
        type: '',
        quantity: '',
        keterangan: '',
        systemQuantity: 0,
        manualQuantity: '',
      },
      products: [],
      categories: [],
      outlets: [],
      productNameQuery: '',
      categoryQuery: '',
      outletQuery: '',
      suggestions: [],
      outletSuggestions: [],
      showSuggestions: false,
      showOutletSuggestions: false,
      debounceTimer: null,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  mounted() {
    this.fetchProductsList()
    this.fetchCategories()
    this.fetchOutlets()
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  methods: {
    async fetchProductsList() {
      try {
        const response = await axios.get(`${BASE_URL}products`)
        if (response.data.status) {
          this.products = response.data.data
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${BASE_URL}categories`)
        if (response.data.status) {
          this.categories = response.data.data
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async fetchOutlets() {
      try {
        const response = await axios.get(`${BASE_URL}outlets`)
        if (response.data.status) {
          this.outlets = response.data.data
        }
      } catch (error) {
        console.error('Error fetching outlets:', error)
      }
    },
    onProductNameInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchProducts()
      }, 300)
    },
    async fetchProducts() {
      const hasProductQuery = this.productNameQuery.trim()
      const hasCategoryQuery = this.categoryQuery.trim()
      if (!hasProductQuery && !hasCategoryQuery) {
        this.suggestions = []
        this.showSuggestions = false
        return
      }
      try {
        const response = await axios.get(`${BASE_URL}products`)
        const products = response.data.data
        this.suggestions = products.filter((product) => {
          const matchesName = hasProductQuery
            ? product.nama.toLowerCase().includes(this.productNameQuery.toLowerCase())
            : true
          const matchesCategory = hasCategoryQuery
            ? product.category &&
              product.category.nama.toLowerCase().includes(this.categoryQuery.toLowerCase())
            : true
          return matchesName && matchesCategory
        })
        this.showSuggestions = true
      } catch (error) {
        console.error('Error fetching products:', error)
        this.suggestions = []
        this.showSuggestions = false
      }
    },
    async selectProduct(product) {
      this.formData.product_id = product.id
      this.productNameQuery = product.nama
      this.categoryQuery = product.category ? product.category.nama : ''
      this.formData.category_id = product.category ? product.category.id : ''
      this.showSuggestions = false
      // Fetch system quantity
      await this.fetchSystemQuantity(product.id)
    },
    async fetchSystemQuantity(productId) {
      try {
        const response = await axios.get(`${BASE_URL}products/inventory/${productId}`)
        if (response.data.status) {
          this.formData.systemQuantity = response.data.data.quantity
        }
      } catch (error) {
        console.error('Error fetching system quantity:', error)
        this.formData.systemQuantity = 0
      }
    },
    onCategoryInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchProducts()
      }, 300)
    },
    onOutletInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchOutletsSuggestions()
      }, 300)
    },
    async fetchOutletsSuggestions() {
      const hasOutletQuery = this.outletQuery.trim()
      if (!hasOutletQuery) {
        this.outletSuggestions = []
        this.showOutletSuggestions = false
        return
      }
      try {
        const response = await axios.get(`${BASE_URL}outlets`)
        const outlets = response.data.data
        this.outletSuggestions = outlets.filter((outlet) =>
          outlet.nama.toLowerCase().includes(this.outletQuery.toLowerCase()),
        )
        this.showOutletSuggestions = true
      } catch (error) {
        console.error('Error fetching outlets:', error)
        this.outletSuggestions = []
        this.showOutletSuggestions = false
      }
    },
    selectOutlet(outlet) {
      this.formData.outlet_id = outlet.id
      this.outletQuery = outlet.nama
      this.showOutletSuggestions = false
    },
    async handleSubmit() {
      const pic_name = localStorage.getItem('username')
      const payload = {
        product_id: this.formData.product_id,
        type: this.formData.type === 'in' ? 'income' : 'outcome',
        outlet_id: this.formData.outlet_id,
        quantity: this.formData.manualQuantity,
        keterangan: this.formData.keterangan,
        pic: pic_name,
      }
      console.log('Data Payload: ', payload)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}products/moving`, payload)
        this.message_toast = response.data.message || 'Inventory adjustment berhasil'
        this.showToast = true
        // Reset form
        this.formData = {
          product_id: '',
          category_id: '',
          outlet_id: '',
          type: '',
          quantity: '',
          keterangan: '',
          systemQuantity: 0,
          manualQuantity: '',
        }
        this.productNameQuery = ''
        this.categoryQuery = ''
        this.outletQuery = ''
        this.suggestions = []
        this.outletSuggestions = []
        this.showSuggestions = false
        this.showOutletSuggestions = false
      } catch (error) {
        console.error('Error submitting inventory adjustment:', error)
        this.message_toast = 'Gagal melakukan inventory adjustment'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for responsive layout */
@media (max-width: 768px) {
  .form-section {
    padding: 12px;
  }

  .grid {
    grid-template-columns: 1fr; /* Stack form fields vertically on smaller screens */
  }
}

/* Suggestions list styles */
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion-item:hover {
  background: #f5f5f5;
}
</style>
