<template>
  <div class="delivery-orders-container">
    <div class="top-bar">
      <h2>Daftar Delivery Orders</h2>
    </div>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari delivery order..."
        class="search-input"
      />
    </div>
    <!-- Tabel untuk desktop -->
    <table class="delivery-orders-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>No. Delivery Order</th>
          <th>Outlet</th>
          <th>PIC</th>
          <th>Tanggal</th>
          <th>Jumlah Items</th>
          <th>Total Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in filteredOrders"
          :key="order.id"
          @click="order.status === 'closed' ? null : viewDetail(order.id)"
          class="clickable-row"
          :class="{
            'completed-row': order.status === 'closed',
            'clickable-row': order.status !== 'closed',
          }"
        >
          <td>{{ order.no_do }}</td>
          <td>{{ order.delivery_order_items[0]?.outlet_name }}</td>
          <td>{{ order.pic }}</td>
          <td>{{ formatDate(order.tanggal) }}</td>
          <td>{{ order.delivery_order_items.length }}</td>
          <td>{{ getTotalQuantity(order.delivery_order_items) }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="delivery-orders-card-list" v-if="isMobile">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="delivery-orders-card"
        @click="order.status === 'closed' ? null : viewDetail(order.id)"
        :class="{
          'completed-card': order.status === 'closed',
          'delivery-orders-card': order.status !== 'closed',
        }"
      >
        <div class="order-info">
          <div class="order-no">{{ order.no_do }}</div>
          <div class="order-outlet">Outlet: {{ order.delivery_order_items[0]?.outlet_name }}</div>
          <div class="order-pic">PIC: {{ order.pic }}</div>
          <div class="order-date">{{ formatDate(order.tanggal) }}</div>
          <div class="order-items">Items: {{ order.delivery_order_items.length }}</div>
          <div class="order-total">
            Total Qty: {{ getTotalQuantity(order.delivery_order_items) }}
          </div>
          <div v-if="order.status === 'closed'" class="status-badge">Selesai</div>
        </div>
      </div>
    </div>

    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script>
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import api from '@/user/axios.js'

export default {
  name: 'TableDeliveryOrders',
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
          order.no_do.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.delivery_order_items[0]?.outlet_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          order.pic.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchDeliveryOrders()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchDeliveryOrders() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}delivery-orders/list`)
        if (response.data.status) {
          this.orders = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data delivery orders'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching delivery orders:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data delivery orders'
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
    getTotalQuantity(items) {
      return items.reduce((total, item) => total + item.quantity, 0)
    },
    viewDetail(orderId) {
      this.$router.push(`/delivery/orders/${orderId}`)
    },
  },
}
</script>

<style scoped>
.delivery-orders-container {
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

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 300px;
}

.delivery-orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delivery-orders-table th,
.delivery-orders-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.delivery-orders-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: #f5f5f5;
}

.completed-row {
  background-color: #e8f5e8;
  cursor: default;
}

.completed-row:hover {
  background: #e8f5e8;
}

.completed-card {
  background-color: #e8f5e8;
  border-left: 4px solid #28a745;
}

.completed-card:hover {
  background: #e8f5e8;
  transform: none;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

/* Mobile styles */
.delivery-orders-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.delivery-orders-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.delivery-orders-card:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  transition: all 0.2s ease;
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

.order-pic,
.order-date,
.order-items,
.order-total {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .delivery-orders-table {
    display: none;
  }
  .delivery-orders-card-list {
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
  .delivery-orders-card-list {
    display: none;
  }
}
</style>
