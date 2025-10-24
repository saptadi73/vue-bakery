<template>
  <div class="outlet-order-summary-table-container">
    <h2>Breakdown Order per Outlet</h2>
    <div v-if="productName" class="product-title">
      Produk: <b>{{ productName }}</b>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari outlet..." class="search-input" />
    </div>
    <table class="outlet-order-summary-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar Outlet</th>
          <th>Nama Outlet</th>
          <th>ID Outlet</th>
          <th>Jumlah Order</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.outlet_id">
          <td>
            <img
              :src="
                item.gambar
                  ? `${BASE_URL}${item.gambar}`
                  : `${BASE_URL}uploads/outlets/outlet_default.jpg`
              "
              alt="Gambar Outlet"
              class="outlet-img"
              loading="lazy"
              @click="
                showImageModal(
                  item.gambar
                    ? `${BASE_URL}${item.gambar}`
                    : `${BASE_URL}uploads/outlets/outlet_default.jpg`,
                )
              "
              style="cursor: pointer"
            />
          </td>
          <td>{{ item.outlet_name }}</td>
          <td>{{ item.outlet_id }}</td>
          <td>{{ item.total_quantity }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="outlet-order-summary-card-list" v-else>
      <div class="outlet-order-summary-card" v-for="item in paginatedData" :key="item.outlet_id">
        <div class="order-row outlet-img-row">
          <img
            :src="
              item.gambar
                ? `${BASE_URL}${item.gambar}`
                : `${BASE_URL}uploads/outlets/outlet_default.jpg`
            "
            alt="Gambar Outlet"
            class="outlet-img"
            loading="lazy"
            @click="
              showImageModal(
                item.gambar
                  ? `${BASE_URL}${item.gambar}`
                  : `${BASE_URL}uploads/outlets/outlet_default.jpg`,
              )
            "
            style="cursor: pointer"
          />
        </div>
        <div class="order-row">
          <span class="order-label">Nama Outlet:</span> {{ item.outlet_name }}
        </div>
        <div class="order-row">
          <span class="order-label">ID Outlet:</span> {{ item.outlet_id }}
        </div>
        <div class="order-row">
          <span class="order-label">Jumlah Order:</span> {{ item.total_quantity }}
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
import { useRoute } from 'vue-router'

export default {
  name: 'TableOutletOrderSummary',
  components: {
    LoadingOverlay,
  },
  setup() {
    const route = useRoute()
    // Ambil nama produk dari params
    const productName = route.params.nama || ''
    return { route, productName }
  },
  data() {
    return {
      BASE_URL,
      loadingStore: useLoadingStore(),
      data: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      isMobile: false,
      showModal: false,
      modalImageUrl: '',
    }
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.data
      const q = this.searchQuery.toLowerCase()
      return this.data.filter(
        (item) =>
          (item.outlet_name && item.outlet_name.toLowerCase().includes(q)) ||
          (item.outlet_id && item.outlet_id.toLowerCase().includes(q)),
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
    async fetchData(id) {
      try {
        this.loadingStore.show()
        // Ganti endpoint sesuai kebutuhan, misal: /orders/summary/outlet/:id
        const response = await axios.get(`${BASE_URL}orders/products/${id}`)
        this.data = response.data.data // Sesuaikan dengan struktur respons API Anda
        console.log(this.data)
      } catch (error) {
        console.error('Error fetching outlet order summary:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 600
    },
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    // Ambil id dari params dan fetch data
    if (this.route && this.route.params && this.route.params.id) {
      this.fetchData(this.route.params.id)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
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
.outlet-order-summary-table-container {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.outlet-order-summary-table {
  width: 100%;
  border-collapse: collapse;
}
.outlet-order-summary-table th,
.outlet-order-summary-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.outlet-img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #f5f5f5;
  margin-right: 4px;
}
.outlet-img-row {
  justify-content: center;
  margin-bottom: 10px;
}
.outlet-order-summary-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.outlet-order-summary-card {
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
  .outlet-order-summary-table {
    display: none;
  }
  .outlet-order-summary-card-list {
    display: flex;
  }
}
@media (min-width: 601px) {
  .outlet-order-summary-card-list {
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
