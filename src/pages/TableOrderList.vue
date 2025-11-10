<template>
  <div class="order-list-container">
    <div class="top-bar">
      <h2>Daftar Order</h2>
      <button class="add-btn" @click="$router.push('/create-order')">+ Buat Order Baru</button>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari order..." class="search-input" />
    </div>
    <!-- Status Filter -->
    <div class="filter-bar">
      <select v-model="statusFilter" class="filter-select">
        <option value="">Semua Status</option>
        <option value="open">Open</option>
        <option value="delivered">Delivered</option>
        <option value="completed">Completed</option>
      </select>
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
            <span :class="getStatusClass(order.status)" class="status-badge">
              {{ order.status }}
            </span>
          </td>
          <td>
            <button
              v-if="order.status !== 'delivered' && order.status !== 'completed'"
              class="edit-btn"
              @click="editOrder(order)"
            >
              Edit
            </button>
            <button
              v-if="order.status !== 'delivered' && order.status !== 'completed'"
              class="delete-btn"
              @click="confirmDelete(order)"
            >
              Delete
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
            <span :class="getStatusClass(order.status)" class="status-badge">
              {{ order.status }}
            </span>
          </div>
        </div>
        <div class="order-actions">
          <button
            v-if="order.status !== 'delivered' && order.status !== 'completed'"
            class="edit-btn"
            @click="editOrder(order)"
          >
            Edit
          </button>
          <button
            v-if="order.status !== 'delivered' && order.status !== 'completed'"
            class="delete-btn"
            @click="confirmDelete(order)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>Hapus Order</h3>
        <p>
          Apakah Anda yakin ingin menghapus order <strong>{{ deleteOrder?.no_order }}</strong
          >?
        </p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">Batal</button>
          <button class="delete-confirm-btn" @click="deleteOrderConfirmed">Hapus</button>
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
import api from '@/user/axios.js'

export default {
  name: 'TableOrderList',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      orders: [],
      searchQuery: '',
      statusFilter: '',
      isMobile: false,
      showDeleteModal: false,
      deleteOrder: null,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders

      // Search filter
      if (this.searchQuery) {
        filtered = filtered.filter(
          (order) =>
            order.no_order.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            order.pic_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            order.outlet_name.toLowerCase().includes(this.searchQuery.toLowerCase()),
        )
      }

      // Status filter
      if (this.statusFilter) {
        filtered = filtered.filter((order) => order.status === this.statusFilter)
      }

      return filtered
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
        const response = await axios.get(`${BASE_URL}orders/list/${outletId}`)
        if (response.data.status) {
          this.orders = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data order'
          this.showToast = true
        }

        console.log('Fetched orders Order List:', this.orders)
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
        open: 'status-new',
        delivered: 'status-delivered',
        completed: 'status-completed',
      }
      return classes[status] || 'status-default'
    },
    editOrder(order) {
      this.$router.push(`/order/edit/${order.id}`)
    },
    confirmDelete(order) {
      this.deleteOrder = order
      this.showDeleteModal = true
    },
    async deleteOrderConfirmed() {
      this.isLoading = true
      try {
        await api.delete(`${BASE_URL}orders/${this.deleteOrder.id}`)
        this.message_toast = 'Order berhasil dihapus'
        this.showToast = true
        this.showDeleteModal = false
        this.deleteOrder = null
        // Refresh orders after delete
        this.fetchOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
        this.message_toast = 'Gagal menghapus order'
        this.showToast = true
      } finally {
        this.isLoading = false
      }
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

.filter-bar {
  margin-bottom: 16px;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 200px;
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

.status-delivered {
  background: #e8f5e8;
  color: #388e3c;
}

.status-completed {
  background: #fff3e0;
  color: #f57c00;
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
  .filter-select {
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
</style>
