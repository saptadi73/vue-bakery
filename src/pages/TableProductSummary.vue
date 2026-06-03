<template>
  <div class="product-summary-container">
    <h2 class="font-lexend text-slate-300">Ringkasan Order</h2>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama atau kode produk..."
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-filter">
        <option value="">Semua Kategori</option>
        <option v-for="category in uniqueCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kode</th>
            <th>Harga</th>
            <th>Stock</th>
            <th>Total Orders</th>
            <th>Total Harga</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <router-link
                v-if="getTotalOrders(product) > 0"
                :to="`/order/summary/outlet/${product.id}/${encodeURIComponent(product.nama)}`"
                class="product-link"
              >
                {{ product.nama }}
              </router-link>
              <span v-else>{{ product.nama }}</span>
            </td>
            <td>{{ product.kode }}</td>
            <td>{{ formatCurrency(product.harga ?? product.harga_jual ?? 0) }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ getTotalOrders(product) }}</td>
            <td>{{ formatCurrency(getTotalHarga(product)) }}</td>
            <td>{{ product.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="summary-total-box">
      <span>Total Nilai Orders:</span>
      <strong>{{ formatCurrency(grandTotalHarga) }}</strong>
    </div>
    <loading-overlay />
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'

export default {
  name: 'TableProductSummary',
  components: { LoadingOverlay },
  data() {
    return {
      products: [],
      searchQuery: '',
      selectedCategory: '',
      summaryTotalFromApi: null,
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  methods: {
    async fetchProducts() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/summary`)
        const payload = response?.data?.data

        if (Array.isArray(payload)) {
          this.products = payload
          this.summaryTotalFromApi =
            Number(response?.data?.total_nilai_orders ?? response?.data?.total_ordered_value) ||
            null
        } else {
          this.products = payload?.items ?? payload?.products ?? []
          this.summaryTotalFromApi =
            Number(
              payload?.total_nilai_orders ??
                payload?.total_ordered_value ??
                response?.data?.total_nilai_orders ??
                response?.data?.total_ordered_value,
            ) || null
        }

        console.log('Fetched product summary:', this.products)
      } catch (err) {
        console.error('Error fetching product summary:', err)
      } finally {
        this.loadingStore.hide()
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(Number(value) || 0)
    },
    getHarga(product) {
      return Number(product?.harga ?? product?.harga_jual ?? 0)
    },
    getTotalOrders(product) {
      return Number(product?.total_orders ?? product?.quantity ?? product?.qty ?? 0)
    },
    getTotalHarga(product) {
      const backendTotal = Number(
        product?.total_harga ??
          product?.total_ordered_value ??
          product?.subtotal_ordered ??
          product?.subtotal ??
          product?.total,
      )
      if (Number.isFinite(backendTotal) && backendTotal > 0) {
        return backendTotal
      }
      return this.getHarga(product) * this.getTotalOrders(product)
    },
  },
  computed: {
    uniqueCategories() {
      const categories = this.products.map((p) => p.category)
      return [...new Set(categories)].sort()
    },
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
        filtered = filtered.filter((p) => p.category === this.selectedCategory)
      }
      return filtered.sort((a, b) => this.getTotalOrders(b) - this.getTotalOrders(a))
    },
    hasActiveFilters() {
      return Boolean(this.searchQuery || this.selectedCategory)
    },
    grandTotalHarga() {
      if (!this.hasActiveFilters && Number.isFinite(this.summaryTotalFromApi)) {
        return this.summaryTotalFromApi
      }
      return this.filteredProducts.reduce((sum, product) => sum + this.getTotalHarga(product), 0)
    },
  },
  mounted() {
    this.fetchProducts()
  },
}
</script>

<style scoped>
.product-summary-container {
  max-width: 1200px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-x: auto;
}

.product-summary-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 2em;
  font-weight: 700;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  width: 300px;
  max-width: 100%;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.category-filter {
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  width: 200px;
  max-width: 100%;
  font-size: 1em;
  transition: border-color 0.3s;
}

.category-filter:focus {
  outline: none;
  border-color: #007bff;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 1em;
}

.product-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ddd;
}

.product-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #e8f4fd;
}

.product-table td {
  color: #333;
}

.product-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.product-link:hover {
  text-decoration: underline;
}

.summary-total-box {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  font-size: 1.05em;
  color: #1f2937;
}

@media (max-width: 768px) {
  .product-summary-container {
    padding: 16px;
  }

  .search-bar {
    flex-direction: column;
    align-items: center;
  }

  .search-input {
    width: 100%;
  }

  .category-filter {
    width: 100%;
  }

  .product-table th,
  .product-table td {
    padding: 10px 12px;
    font-size: 0.9em;
  }

  .summary-total-box {
    justify-content: space-between;
    font-size: 0.95em;
  }
}
</style>
