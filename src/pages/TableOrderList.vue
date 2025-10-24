<template>
  <div class="order-table-container">
    <h2>Daftar Order</h2>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari order, produk, outlet..."
        class="search-input"
      />
    </div>
    <table class="order-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar</th>
          <th>Nama Produk</th>
          <th>No. Order</th>
          <th>Quantity</th>
          <th>Nama Outlet</th>
          <th>Tanggal Order</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.no_order">
          <td>
            <img
              :src="
                order.gambar
                  ? `${BASE_URL}${order.gambar}`
                  : `${BASE_URL}uploads/products/default_cake.jpg`
              "
              alt="Gambar Produk"
              class="order-img"
              loading="lazy"
            />
          </td>
          <td>{{ order.product_name }}</td>
          <td>{{ order.no_order }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.outlet_name }}</td>
          <td>{{ order.tanggal }}</td>
          <td>
            <span
              :class="[
                'status-text',
                order.status === 'Ordered' ? 'status-ordered' : 'status-open',
              ]"
            >
              {{ order.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="order-card-list" v-else>
      <div class="order-card" v-for="order in paginatedOrders" :key="order.id">
        <div class="order-row order-img-row">
          <img
            :src="
              order.gambar
                ? `${BASE_URL}${order.gambar}`
                : `${BASE_URL}uploads/products/default_cake.jpg`
            "
            alt="Gambar Produk"
            class="order-img"
            loading="lazy"
          />
        </div>
        <div class="order-row">
          <span class="order-label">Nama Produk:</span> {{ order.product_name }}
        </div>
        <div class="order-row">
          <span class="order-label">No. Order:</span> {{ order.no_order }}
        </div>
        <div class="order-row"><span class="order-label">Quantity:</span> {{ order.quantity }}</div>
        <div class="order-row">
          <span class="order-label">Nama Outlet:</span> {{ order.outlet_name }}
        </div>
        <div class="order-row">
          <span class="order-label">Tanggal Order:</span> {{ order.tanggal }}
        </div>
        <div class="order-row">
          <span class="order-label">Status:</span>
          <span
            :class="['status-text', order.status === 'Ordered' ? 'status-ordered' : 'status-open']"
          >
            {{ order.status }}
          </span>
        </div>
      </div>
    </div>
    <div class="pagination-bar">
      <button :disabled="currentPage === 1" @click="currentPage--">&laquo;</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">&raquo;</button>
    </div>
  </div>
  <LoadingOverlay />
</template>

<script>
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'TableOrderList',
  components: { LoadingOverlay },
  data() {
    return {
      BASE_URL,
      loadingStore: useLoadingStore(),
      orders: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      isMobile: false,
    }
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) return this.orders
      const q = this.searchQuery.toLowerCase()
      return this.orders.filter(
        (o) =>
          o.no_order.toLowerCase().includes(q) ||
          o.product_name.toLowerCase().includes(q) ||
          o.outlet_name.toLowerCase().includes(q) ||
          o.tanggal.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q),
      )
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize))
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredOrders.slice(start, start + this.pageSize)
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    filteredOrders() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
    },
  },
  methods: {
    async fetchOrders() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${this.BASE_URL}orders/list`)
        this.orders = response.data.data
        console.log(this.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 600
    },
  },
  created() {
    this.fetchOrders()
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
//
</script>

<style scoped>
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
.order-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-card {
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
  .order-table {
    display: none;
  }
  .order-card-list {
    display: flex;
  }
}
@media (min-width: 601px) {
  .order-card-list {
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
.order-table-container {
  max-width: 900px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
}
.order-table th,
.order-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
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
</style>
