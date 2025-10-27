<template>
  <div class="order-list-container">
    <div class="top-bar">
      <h2>Daftar Order</h2>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari order..." class="search-input" />
    </div>
    <!-- Tabel untuk desktop -->
    <table class="order-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>No. Order</th>
          <th>Tanggal</th>
          <th>PIC Name</th>
          <th>Outlet Name</th>
          <th>Status Order</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.no_order }}</td>
          <td>{{ formatDate(order.tanggal) }}</td>
          <td>{{ order.pic_name }}</td>
          <td>{{ order.outlet_name }}</td>
          <td>
            <span :class="getStatusClass(order.status_order)" class="status-badge">
              {{ order.status_order }}
            </span>
          </td>
          <td>
            <button
              v-if="order.status_order !== 'delivered'"
              class="delivery-btn"
              @click="createDelivery(order)"
            >
              <i class="fas fa-truck"></i> Create Delivery
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="order-card-list" v-if="isMobile">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-info">
          <div class="order-no">{{ order.no_order }}</div>
          <div class="order-date">{{ formatDate(order.tanggal) }}</div>
          <div class="order-pic">PIC: {{ order.pic_name }}</div>
          <div class="order-outlet">Outlet: {{ order.outlet_name }}</div>
          <div class="order-status">
            <span :class="getStatusClass(order.status_order)" class="status-badge">
              {{ order.status_order }}
            </span>
          </div>
        </div>
        <div class="order-actions">
          <button
            v-if="order.status_order !== 'delivered'"
            class="delivery-btn"
            @click="createDelivery(order)"
          >
            <i class="fas fa-truck"></i> Create Delivery
          </button>
        </div>
      </div>
    </div>

    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'

export default {
  name: 'TableOrderList',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      orders: [],
      searchQuery: '',
      isMobile: false,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) return this.orders
      return this.orders.filter(
        (order) =>
          order.no_order.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.pic_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.outlet_name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchOrders()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchOrders() {
      this.isLoading = true
      try {
        const outletId = localStorage.getItem('outlet_id')
        if (!outletId) {
          this.message_toast = 'Outlet ID tidak ditemukan'
          this.showToast = true
          return
        }
        const response = await axios.get(`${BASE_URL}orders/list-all`)
        if (response.data.status) {
          this.orders = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data order'
        this.showToast = true
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getStatusClass(status) {
      const classes = {
        new: 'status-new',
        processing: 'status-processing',
        completed: 'status-completed',
        cancelled: 'status-cancelled',
      }
      return classes[status] || 'status-default'
    },
    createDelivery(order) {
      this.$router.push(`/delivery/create/${order.id}`)
    },
  },
}
</script>

<style scoped>
.order-list-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.top-bar h2 {
  margin: 0;
  color: #333;
}

.add-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #45a049;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 300px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-table th,
.order-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.order-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.status-new {
  background: #e3f2fd;
  color: #1976d2;
}

.status-processing {
  background: #fff3e0;
  color: #f57c00;
}

.status-completed {
  background: #e8f5e8;
  color: #388e3c;
}

.status-cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.edit-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 0.9em;
}

.edit-btn:hover {
  background: #1976d2;
}

.delete-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
}

.delete-btn:hover {
  background: #d32f2f;
}

/* Mobile styles */
.order-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  flex: 1;
}

.order-no {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.order-date,
.order-pic,
.order-outlet {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 2px;
}

.order-status {
  margin-top: 8px;
}

.order-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .order-table {
    display: none;
  }
  .order-card-list {
    display: flex;
  }
  .top-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .order-card-list {
    display: none;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 16px;
  color: #333;
}

.modal-content p {
  margin-bottom: 24px;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel-btn {
  background: #9e9e9e;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #757575;
}

.delete-confirm-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.delete-confirm-btn:hover {
  background: #d32f2f;
}

.delivery-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.delivery-btn:hover {
  background: linear-gradient(135deg, #45a049, #4caf50);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.delivery-btn i {
  font-size: 1em;
}
</style>
