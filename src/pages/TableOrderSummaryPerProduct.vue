<template>
  <div class="order-summary-table-container">
    <h2>Rekap Jumlah Order per Produk</h2>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari produk..." class="search-input" />
    </div>
    <table class="order-summary-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar</th>
          <th>Kode Produk</th>
          <th>Nama Produk</th>
          <th>Jumlah Order</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.product_id">
          <td>
            <img
              :src="
                item.gambar
                  ? `${BASE_URL}${item.gambar}`
                  : `${BASE_URL}uploads/products/default_cake.jpg`
              "
              alt="Gambar Produk"
              class="order-img"
              loading="lazy"
              @click="
                showImageModal(
                  item.gambar
                    ? `${BASE_URL}${item.gambar}`
                    : `${BASE_URL}uploads/products/default_cake.jpg`,
                )
              "
              style="cursor: pointer"
            />
          </td>
          <td>{{ item.kode }}</td>
          <td>
            <router-link
              :to="`/order/summary/outlet/${item.product_id}/${encodeURIComponent(item.product_name)}`"
              class="product-link"
            >
              {{ item.product_name }}
            </router-link>
          </td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="order-summary-card-list" v-else>
      <div class="order-summary-card" v-for="item in paginatedData" :key="item.product_id">
        <div class="order-row order-img-row">
          <img
            :src="
              item.gambar
                ? `${BASE_URL}${item.gambar}`
                : `${BASE_URL}uploads/products/default_cake.jpg`
            "
            alt="Gambar Produk"
            class="order-img"
            loading="lazy"
            @click="
              showImageModal(
                item.gambar
                  ? `${BASE_URL}${item.gambar}`
                  : `${BASE_URL}uploads/products/default_cake.jpg`,
              )
            "
            style="cursor: pointer"
          />
        </div>
        <div class="order-row"><span class="order-label">Kode Produk:</span> {{ item.kode }}</div>
        <div class="order-row">
          <span class="order-label">Nama Produk:</span>
          <router-link
            :to="`/order/summary/outlet/${item.product_id}/${encodeURIComponent(item.product_name)}`"
            class="product-link"
          >
            {{ item.product_name }}
          </router-link>
        </div>
        <div class="order-row">
          <span class="order-label">Jumlah Order:</span> {{ item.quantity }}
        </div>
      </div>
    </div>
    <!-- Modal Gambar Besar -->
    <div v-if="showModal" class="img-modal-overlay" @click.self="closeImageModal">
      <div class="img-modal-content">
        <img :src="modalImageUrl" alt="Gambar Besar" />
        <button class="img-modal-close" @click="closeImageModal">&times;</button>
      </div>
    </div>
    <div class="pagination-bar">
      <button :disabled="currentPage === 1" @click="currentPage--">&laquo;</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">&raquo;</button>
    </div>
  </div>
  <loading-overlay />
</template>

<script>
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'TableOrderSummaryPerProduct',
  components: { LoadingOverlay },
  data() {
    return {
      data: [],
      BASE_URL,
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      isMobile: false,
      showModal: false,
      modalImageUrl: '',
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.data
      const q = this.searchQuery.toLowerCase()
      return this.data.filter(
        (item) =>
          (item.product_name && item.product_name.toLowerCase().includes(q)) ||
          (item.kode_produk && item.kode_produk.toLowerCase().includes(q)),
      )
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize))
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    filteredData() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
    },
  },
  methods: {
    showImageModal(url) {
      this.modalImageUrl = url
      this.showModal = true
    },
    closeImageModal() {
      this.showModal = false
      this.modalImageUrl = ''
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 600
    },
    async fetchData() {
      this.loadingStore.show()
      try {
        const response = await axios.get(`${BASE_URL}orders/products`)
        this.data = response.data.data
        console.log('Fetched order summary data:', this.data)
      } catch (error) {
        console.error('Error fetching order summary data:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.product-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.18s;
}
.product-link:hover {
  color: #0d47a1;
}
/* Modal Gambar */
.img-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.img-modal-content {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 18px 18px 8px 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img-modal-content img {
  max-width: 70vw;
  max-height: 60vh;
  border-radius: 8px;
  object-fit: contain;
}
.img-modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: #fff;
  border: none;
  font-size: 2.2em;
  color: #444;
  cursor: pointer;
  line-height: 1;
  padding: 0 8px;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: background 0.18s;
}
.img-modal-close:hover {
  background: #eee;
}
.order-summary-table-container {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.order-summary-table {
  width: 100%;
  border-collapse: collapse;
}
.order-summary-table th,
.order-summary-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.order-img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #f5f5f5;
  margin-right: 4px;
}
.order-img-row {
  justify-content: center;
  margin-bottom: 10px;
}
.order-summary-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-summary-card {
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 16px 18px;
  margin-bottom: 4px;
  font-size: 1.04em;
}
.order-row {
  margin-bottom: 7px;
  display: flex;
  gap: 8px;
}
.order-label {
  font-weight: 600;
  color: #666;
  min-width: 110px;
  display: inline-block;
}
@media (max-width: 600px) {
  .order-summary-table {
    display: none;
  }
  .order-summary-card-list {
    display: flex;
  }
}
@media (min-width: 601px) {
  .order-summary-card-list {
    display: none;
  }
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
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
}
.pagination-bar button {
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 5px;
  padding: 4px 12px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.18s;
}
.pagination-bar button:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
</style>
