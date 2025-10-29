<template>
  <div class="detail-receive-container">
    <div class="header">
      <button @click="$router.go(-1)" class="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>
      <h1>Detail Receive: {{ receive?.no_rec }}</h1>
    </div>

    <div class="receive-info">
      <div class="info-section">
        <h3>Informasi Receive</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>No. Receive:</label>
            <span>{{ receive?.no_rec }}</span>
          </div>
          <div class="info-item">
            <label>Delivery Order:</label>
            <span>{{ receive?.delivery_order?.no_do }}</span>
          </div>
          <div class="info-item">
            <label>PIC:</label>
            <span>{{ receive?.pic }}</span>
          </div>
          <div class="info-item">
            <label>Tanggal:</label>
            <span>{{ formatDate(receive?.tanggal) }}</span>
          </div>
          <div class="info-item">
            <label>Keterangan:</label>
            <span>{{ receive?.keterangan || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="items-section">
      <h3>Receive Items</h3>
      <div class="items-table-container">
        <table class="items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Delivered</th>
              <th>Quantity Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in receive?.receive_items" :key="item.id">
              <td>{{ item.product_name }}</td>
              <td>{{ item.delivery_order_item?.quantity }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <span :class="getStatusClass(item)">
                  {{ getStatusText(item) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
  name: 'DetailReceive',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      receive: null,
      isLoading: false,
      showToast: false,
      message_toast: '',
    }
  },
  mounted() {
    this.fetchReceiveDetail()
  },
  methods: {
    async fetchReceiveDetail() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}receives/${this.$route.params.id}`)
        if (response.data.status) {
          this.receive = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil detail receive'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching receive detail:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil detail receive'
        this.showToast = true
      } finally {
        this.isLoading = false
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
    getStatusClass(item) {
      const delivered = item.delivery_order_item?.quantity || 0
      const received = item.quantity || 0
      if (received === delivered) return 'status-complete'
      if (received < delivered) return 'status-partial'
      return 'status-excess'
    },
    getStatusText(item) {
      const delivered = item.delivery_order_item?.quantity || 0
      const received = item.quantity || 0
      if (received === delivered) return 'Complete'
      if (received < delivered) return 'Partial'
      return 'Excess'
    },
  },
}
</script>

<style scoped>
.detail-receive-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  background: #0056b3;
}

.receive-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item span {
  color: #333;
  font-size: 16px;
}

.items-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.items-section h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.items-table-container {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.items-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.status-complete {
  color: #28a745;
  font-weight: 600;
}

.status-partial {
  color: #ffc107;
  font-weight: 600;
}

.status-excess {
  color: #dc3545;
  font-weight: 600;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .items-table-container {
    font-size: 14px;
  }

  .items-table th,
  .items-table td {
    padding: 8px 12px;
  }
}
</style>
