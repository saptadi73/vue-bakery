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
          <th>Product ID</th>
          <th>Kode Produk</th>
          <th>Nama Produk</th>
          <th>Jumlah Order</th>
          <th>Stock Kitchen</th>
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
          <td>{{ item.product_id }}</td>
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
          <td>
            <input
              type="number"
              min="0"
              :value="inputOrders[item.product_id] ?? item.quantity"
              @input="updateInputOrder(item.product_id, $event.target.value)"
              style="width: 70px; margin-right: 8px"
              placeholder="Stock Kitchen"
            />
            <button type="button" @click="submitOrder(item.product_id, item.product_name)">
              Isi
            </button>
          </td>
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
        <div class="order-row">
          <span class="order-label">Product ID:</span> {{ item.product_id }}
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
        <div class="order-row">
          <span class="order-label">Stock Kitchen:</span>
          <input
            type="number"
            min="0"
            :value="inputOrders[item.product_id] ?? item.quantity"
            @input="updateInputOrder(item.product_id, $event.target.value)"
            style="width: 70px; margin-right: 8px"
            placeholder="Stock Kitchen"
          />
          <button type="button" @click="submitOrder(item.product_id, item.product_name)">
            Isi
          </button>
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
      loadingStore: useLoadingStore(),
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      isMobile: false,
      showModal: false,
      modalImageUrl: '',
      inputOrders: {},
    }
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
    updateInputOrder(productId, value) {
      this.inputOrders = {
        ...this.inputOrders,
        [productId]: Number(value),
      }
    },
    submitOrder(productId, productName) {
      const value =
        this.inputOrders[productId] ??
        this.paginatedData.find((i) => i.product_id === productId)?.quantity
      // Redirect ke /kitchen/distribution/{product_id}/{product_name}/{quantity}
      const encodedName = encodeURIComponent(productName)
      this.$router.push(`/kitchen/distribution/${productId}/${encodedName}/${value}`)
    },
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
  max-width: 1100px;
  margin: 36px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 36px 32px 32px 32px;
}
.order-summary-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  font-size: 1.08em;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  overflow: hidden;
}
.order-summary-table th {
  background: #f5f7fa;
  color: #333;
  font-weight: 700;
  padding: 16px 14px;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 2;
}
.order-summary-table td {
  padding: 14px 12px;
  border-bottom: 1.5px solid #f0f0f0;
  text-align: center;
  background: #fff;
}
.order-summary-table tr:hover td {
  background: #f7fbff;
  transition: background 0.18s;
}
.order-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  border: 1.5px solid #e0e0e0;
  background: #f5f5f5;
  margin-right: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.order-img-row {
  justify-content: center;
  margin-bottom: 12px;
}
.order-summary-card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.order-summary-card {
  background: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  padding: 20px 20px 16px 20px;
  margin-bottom: 4px;
  font-size: 1.08em;
  border: 1.5px solid #e3e8ee;
}
.order-row {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.order-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 120px;
  display: inline-block;
}
.order-summary-table input[type='number'],
.order-summary-card input[type='number'] {
  padding: 7px 10px;
  border-radius: 7px;
  border: 1.5px solid #bfc9d1;
  font-size: 1em;
  width: 80px;
  background: #f9fafb;
  transition: border 0.18s;
}
.order-summary-table input[type='number']:focus,
.order-summary-card input[type='number']:focus {
  border: 1.5px solid #1976d2;
  outline: none;
}
.order-summary-table button,
.order-summary-card button {
  background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 7px 18px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.08);
  transition: background 0.18s;
}
.order-summary-table button:hover,
.order-summary-card button:hover {
  background: linear-gradient(90deg, #1565c0 60%, #1976d2 100%);
}
@media (max-width: 900px) {
  .order-summary-table-container {
    padding: 18px 2vw;
    max-width: 100vw;
  }
  .order-summary-table th,
  .order-summary-table td {
    padding: 10px 4px;
    font-size: 0.98em;
  }
}
@media (max-width: 600px) {
  .order-summary-table {
    display: none;
  }
  .order-summary-card-list {
    display: flex;
  }
  .order-summary-table-container {
    padding: 8px 0;
    box-shadow: none;
    border-radius: 0;
  }
}
@media (min-width: 601px) {
  .order-summary-card-list {
    display: none;
  }
}
.search-bar {
  margin-bottom: 18px;
  text-align: right;
}
.search-input {
  padding: 9px 14px;
  border-radius: 7px;
  border: 1.5px solid #bfc9d1;
  width: 260px;
  font-size: 1em;
  background: #f9fafb;
  transition: border 0.18s;
}
.search-input:focus {
  border: 1.5px solid #1976d2;
  outline: none;
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 22px;
}
.pagination-bar button {
  background: #fff;
  border: 1.5px solid #bbb;
  border-radius: 7px;
  padding: 6px 18px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.18s;
}
.pagination-bar button:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
</style>
