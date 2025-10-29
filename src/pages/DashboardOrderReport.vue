<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>Laporan Order Dashboard</h1>
      <button class="refresh-btn" @click="fetchOrderReport" :disabled="isLoading">
        <font-awesome-icon :icon="['fas', 'sync-alt']" :spin="isLoading" />
        Refresh
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards" v-if="reportData.summary">
      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'clipboard-list']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.total_orders }}</h3>
          <p>Total Orders</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'truck']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.orders_delivered }}</h3>
          <p>Orders Delivered</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'check-circle']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.orders_closed }}</h3>
          <p>Orders Closed</p>
        </div>
      </div>

      <div class="card warning">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.orders_with_discrepancies }}</h3>
          <p>Orders with Discrepancies</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'boxes']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.total_order_items }}</h3>
          <p>Total Order Items</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'check']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.items_provided }}</h3>
          <p>Items Provided</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'shipping-fast']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.items_delivered }}</h3>
          <p>Items Delivered</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'inbox']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.items_received }}</h3>
          <p>Items Received</p>
        </div>
      </div>

      <div class="card warning">
        <div class="card-icon">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        </div>
        <div class="card-content">
          <h3>{{ reportData.summary.items_with_discrepancies }}</h3>
          <p>Items with Discrepancies</p>
        </div>
      </div>
    </div>

    <!-- Details Table -->
    <div class="details-section" v-if="reportData.details && reportData.details.length > 0">
      <h2>Detail Orders</h2>
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>No. Order</th>
              <th>Outlet</th>
              <th>PIC</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Total Ordered</th>
              <th>Total Delivered</th>
              <th>Total Received</th>
              <th>Discrepancies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in reportData.details"
              :key="order.order_id"
              :class="{ 'has-discrepancies': order.has_discrepancies }"
            >
              <td>{{ order.no_order }}</td>
              <td>{{ order.outlet_name }}</td>
              <td>{{ order.pic_name }}</td>
              <td>{{ formatDate(order.tanggal) }}</td>
              <td>
                <span :class="getStatusClass(order.status_order)" class="status-badge">
                  {{ order.status_order }}
                </span>
              </td>
              <td>{{ order.total_ordered_quantity }}</td>
              <td>{{ order.total_delivered_quantity }}</td>
              <td>{{ order.total_received_quantity }}</td>
              <td>
                <span v-if="order.has_discrepancies" class="discrepancy-badge">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
                  Yes
                </span>
                <span v-else class="no-discrepancy-badge">
                  <font-awesome-icon :icon="['fas', 'check']" />
                  No
                </span>
              </td>
              <td>
                <button class="view-details-btn" @click="toggleOrderDetails(order.order_id)">
                  <font-awesome-icon
                    :icon="
                      expandedOrders.includes(order.order_id)
                        ? ['fas', 'chevron-up']
                        : ['fas', 'chevron-down']
                    "
                  />
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Items Details -->
      <div
        v-for="order in reportData.details"
        :key="'details-' + order.order_id"
        v-show="expandedOrders.includes(order.order_id)"
        class="order-items-details"
      >
        <h4>Items for {{ order.no_order }}</h4>
        <div class="items-table-container">
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Ordered</th>
                <th>Status</th>
                <th>Provided</th>
                <th>Delivered</th>
                <th>Received</th>
                <th>Discrepancy</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in order.items"
                :key="item.product_id"
                :class="{ 'item-discrepancy': item.discrepancy }"
              >
                <td>{{ item.product_name }}</td>
                <td>{{ item.quantity_ordered }}</td>
                <td>
                  <span :class="getItemStatusClass(item.status)" class="item-status-badge">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <font-awesome-icon
                    :icon="item.provided ? ['fas', 'check'] : ['fas', 'times']"
                    :class="item.provided ? 'status-yes' : 'status-no'"
                  />
                </td>
                <td>
                  <font-awesome-icon
                    :icon="item.delivered ? ['fas', 'check'] : ['fas', 'times']"
                    :class="item.delivered ? 'status-yes' : 'status-no'"
                  />
                </td>
                <td>
                  <font-awesome-icon
                    :icon="item.received ? ['fas', 'check'] : ['fas', 'times']"
                    :class="item.received ? 'status-yes' : 'status-no'"
                  />
                </td>
                <td>
                  <font-awesome-icon
                    :icon="item.discrepancy ? ['fas', 'exclamation-triangle'] : ['fas', 'check']"
                    :class="item.discrepancy ? 'status-warning' : 'status-success'"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading" class="empty-state">
      <font-awesome-icon :icon="['fas', 'chart-line']" class="empty-icon" />
      <h3>No Order Data Available</h3>
      <p>There are no orders to display at the moment.</p>
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
  name: 'DashboardOrderReport',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      reportData: {
        summary: null,
        details: [],
      },
      expandedOrders: [],
      isLoading: false,
      showToast: false,
      message_toast: '',
    }
  },
  mounted() {
    this.fetchOrderReport()
  },
  methods: {
    async fetchOrderReport() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}reports/orders`)
        if (response.data.status) {
          this.reportData = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data laporan order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching order report:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data laporan order'
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
        delivered: 'status-delivered',
        completed: 'status-completed',
        closed: 'status-closed',
      }
      return classes[status] || 'status-default'
    },
    getItemStatusClass(status) {
      const classes = {
        open: 'item-status-open',
        provided: 'item-status-provided',
        delivered: 'item-status-delivered',
        received: 'item-status-received',
        closed: 'item-status-closed',
      }
      return classes[status] || 'item-status-default'
    },
    toggleOrderDetails(orderId) {
      const index = this.expandedOrders.indexOf(orderId)
      if (index > -1) {
        this.expandedOrders.splice(index, 1)
      } else {
        this.expandedOrders.push(orderId)
      }
    },
  },
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.refresh-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #1976d2;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-2px);
}

.card.warning {
  border-left: 4px solid #ff9800;
}

.card-icon {
  font-size: 2rem;
  color: #2196f3;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.card.warning .card-icon {
  color: #ff9800;
}

.card-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #333;
  font-weight: 600;
}

.card-content p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.details-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.orders-table th,
.orders-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
}

.has-discrepancies {
  background-color: #fff3e0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
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
  background: #e8f5e8;
  color: #388e3c;
}

.status-closed {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.discrepancy-badge {
  background: #ffebee;
  color: #d32f2f;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.no-discrepancy-badge {
  background: #e8f5e8;
  color: #388e3c;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-details-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.3s;
}

.view-details-btn:hover {
  background: #1976d2;
}

.order-items-details {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.order-items-details h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.items-table-container {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.items-table th,
.items-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.items-table th {
  background: #f1f3f4;
  font-weight: 600;
  color: #333;
}

.item-discrepancy {
  background-color: #fff3e0;
}

.item-status-badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
}

.item-status-open {
  background: #e3f2fd;
  color: #1976d2;
}

.item-status-provided {
  background: #e8f5e8;
  color: #388e3c;
}

.item-status-delivered {
  background: #e8f5e8;
  color: #388e3c;
}

.item-status-received {
  background: #e8f5e8;
  color: #388e3c;
}

.item-status-closed {
  background: #f3e5f5;
  color: #7b1fa2;
}

.item-status-default {
  background: #f5f5f5;
  color: #666;
}

.status-yes {
  color: #388e3c;
}

.status-no {
  color: #d32f2f;
}

.status-warning {
  color: #f57c00;
}

.status-success {
  color: #388e3c;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #999;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 15px;
  }

  .card-content h3 {
    font-size: 1.5rem;
  }

  .table-container {
    font-size: 0.8rem;
  }

  .orders-table th,
  .orders-table td {
    padding: 8px 10px;
  }
}
</style>
