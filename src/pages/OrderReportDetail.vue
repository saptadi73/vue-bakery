<template>
  <div class="order-report-detail-container">
    <div class="header">
      <h1>Order Report Detail</h1>
      <button class="back-btn" @click="$router.go(-1)">← Back</button>
    </div>

    <!-- Order Header Info -->
    <div class="order-header" v-if="orderData">
      <div class="header-grid">
        <div class="header-item">
          <label>Order ID:</label>
          <span>{{ orderData.order_id }}</span>
        </div>
        <div class="header-item">
          <label>No. Order:</label>
          <span>{{ orderData.no_order }}</span>
        </div>
        <div class="header-item">
          <label>Outlet Name:</label>
          <span>{{ orderData.outlet_name }}</span>
        </div>
        <div class="header-item">
          <label>PIC Name:</label>
          <span>{{ orderData.pic_name }}</span>
        </div>
        <div class="header-item">
          <label>Tanggal:</label>
          <span>{{ formatDate(orderData.tanggal) }}</span>
        </div>
        <div class="header-item">
          <label>Status:</label>
          <span :class="getStatusClass(orderData.status)" class="status-badge">{{
            orderData.status
          }}</span>
        </div>
        <div class="header-item">
          <label>Keterangan:</label>
          <span>{{ orderData.keterangan || '-' }}</span>
        </div>
        <div class="header-item">
          <label>Updated At:</label>
          <span>{{ formatDate(orderData.updated_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="products-section" v-if="orderData && orderData.items">
      <h2>Product Details</h2>
      <div class="table-container">
        <table class="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Ordered</th>
              <th>Provided</th>
              <th>Delivered</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orderData.items" :key="item.product_id">
              <td>{{ item.product_name }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span class="quantity-cell clickable" @click="openModal(item, 'ordered')">
                  {{ item.segments.ordered.quantity }}
                </span>
              </td>
              <td>
                <span class="quantity-cell clickable" @click="openModal(item, 'provided')">
                  {{ item.segments.provided.total_quantity }}
                </span>
              </td>
              <td>
                <span class="quantity-cell clickable" @click="openModal(item, 'delivered')">
                  {{ item.segments.delivered.total_quantity }}
                </span>
              </td>
              <td>
                <span class="quantity-cell clickable" @click="openModal(item, 'received')">
                  {{ item.segments.received.total_quantity }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Segment Details -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="modalData && modalData.length > 0">
            <div v-for="(detail, index) in modalData" :key="index" class="detail-item">
              <div class="detail-row">
                <label>PIC:</label>
                <span>{{ detail.pic }}</span>
              </div>
              <div class="detail-row">
                <label>Tanggal:</label>
                <span>{{ formatDate(detail.tanggal) }}</span>
              </div>
              <div class="detail-row">
                <label>Updated At:</label>
                <span>{{ formatDate(detail.updated_at) }}</span>
              </div>
              <div class="detail-row" v-if="detail.keterangan">
                <label>Keterangan:</label>
                <span>{{ detail.keterangan }}</span>
              </div>
              <div class="detail-row" v-if="detail.quantity !== undefined">
                <label>Quantity:</label>
                <span>{{ detail.quantity }}</span>
              </div>
              <hr v-if="index < modalData.length - 1" />
            </div>
          </div>
          <div v-else class="no-data">No details available for this segment.</div>
        </div>
      </div>
    </div>

    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay />
  </div>
</template>

<script>
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import axios from 'axios'
import { useLoadingStore } from '@/stores/loading'

export default {
  name: 'OrderReportDetail',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      orderData: null,
      isLoading: false,
      showToast: false,
      message_toast: '',
      showModal: false,
      modalTitle: '',
      modalData: [],
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  mounted() {
    this.fetchOrderReportDetail()
  },
  methods: {
    async fetchOrderReportDetail() {
      this.loadingStore.show()
      try {
        const orderId = this.$route.params.id
        const response = await axios.get(`${BASE_URL}reports/orders/${orderId}`)
        if (response.data.status) {
          this.orderData = response.data.data
          console.log('Fetched Order Report Detail:', this.orderData)
        } else {
          this.message_toast = 'Failed to fetch order report detail'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching order report detail:', error)
        this.message_toast = 'Error fetching order report detail'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
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
        delivered: 'status-delivered',
        new: 'status-new',
        completed: 'status-completed',
      }
      return classes[status] || 'status-default'
    },
    openModal(item, segment) {
      this.modalTitle = `${item.product_name} - ${segment.charAt(0).toUpperCase() + segment.slice(1)} Details`
      this.modalData = []

      if (segment === 'ordered') {
        this.modalData = [item.segments.ordered]
      } else if (segment === 'provided') {
        this.modalData = item.segments.provided.providers
      } else if (segment === 'delivered') {
        this.modalData = item.segments.delivered.deliveries
      } else if (segment === 'received') {
        this.modalData = item.segments.received.receives
      }

      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalTitle = ''
      this.modalData = []
    },
  },
}
</script>

<style scoped>
.order-report-detail-container {
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
}

.back-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #1976d2;
}

.order-header {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.header-item {
  display: flex;
  flex-direction: column;
}

.header-item label {
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
  font-size: 0.9em;
}

.header-item span {
  color: #333;
  font-size: 1em;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
  display: inline-block;
}

.status-delivered {
  background: #e8f5e8;
  color: #388e3c;
}

.status-new {
  background: #e3f2fd;
  color: #1976d2;
}

.status-completed {
  background: #fff3e0;
  color: #f57c00;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.products-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.products-section h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.table-container {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.products-table th,
.products-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.products-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.products-table tbody tr:hover {
  background: #f5f5f5;
}

.quantity-cell.clickable {
  cursor: pointer;
  color: #2196f3;
  font-weight: 500;
  text-decoration: underline;
}

.quantity-cell.clickable:hover {
  color: #1976d2;
}

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
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-row label {
  font-weight: 600;
  color: #555;
  min-width: 100px;
  margin-right: 8px;
}

.detail-row span {
  color: #333;
}

.detail-item hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .products-table th,
  .products-table td {
    padding: 8px 12px;
    font-size: 0.9em;
  }
}
</style>
