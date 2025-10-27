<template>
  <div class="detail-delivery-order-container">
    <div class="top-bar">
      <h2>Detail Delivery Order</h2>
      <button class="back-btn" @click="$router.go(-1)">← Kembali</button>
    </div>

    <div class="detail-form" v-if="deliveryOrder">
      <!-- PIC Orders Section -->
      <div class="form-section">
        <h3>PIC Orders</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>No. Order</label>
            <input v-model="orderNo" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>PIC Orders</label>
            <input v-model="deliveryOrder.pic" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>Tanggal</label>
            <input v-model="formattedDate" type="text" readonly class="form-control" />
          </div>
        </div>
      </div>

      <!-- PIC Delivery Section -->
      <div class="form-section">
        <h3>PIC Delivery</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>No. Delivery Order</label>
            <input v-model="deliveryOrder.no_pro" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>PIC Delivery</label>
            <input v-model="picDelivery" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>Tanggal Delivery</label>
            <input v-model="formattedDeliveryDate" type="text" readonly class="form-control" />
          </div>
        </div>
      </div>

      <!-- Items Section -->
      <div class="form-section">
        <h3>Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category Name</th>
              <th>Quantity Delivery</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in deliveryOrder.delivery_order_items" :key="item.id">
              <td>{{ getProductName(item) }}</td>
              <td>{{ getCategoryName(item) }}</td>
              <td>{{ item.quantity }}</td>
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
  name: 'DetailDeliveryOrder',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      deliveryOrder: null,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  computed: {
    formattedDate() {
      if (!this.deliveryOrder?.tanggal) return ''
      return this.formatDate(this.deliveryOrder.tanggal)
    },
    formattedDeliveryDate() {
      if (!this.deliveryOrder?.delivery_order_items?.[0]?.tanggal) return ''
      return this.formatDate(this.deliveryOrder.delivery_order_items[0].tanggal)
    },
    picDelivery() {
      if (!this.deliveryOrder?.delivery_order_items?.[0]?.pic) return ''
      return this.deliveryOrder.delivery_order_items[0].pic
    },
    orderNo() {
      if (!this.deliveryOrder?.delivery_order_items?.[0]?.provider?.order_item?.order?.no_order)
        return ''
      return this.deliveryOrder.delivery_order_items[0].provider.order_item.order.no_order
    },
  },
  mounted() {
    this.fetchDeliveryOrderDetail()
  },
  methods: {
    async fetchDeliveryOrderDetail() {
      this.isLoading = true
      try {
        const orderId = this.$route.params.id
        const response = await api.get(`${BASE_URL}delivery-orders/${orderId}`)
        if (response.data.status) {
          this.deliveryOrder = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil detail delivery order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching delivery order detail:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil detail delivery order'
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
    getProductName(item) {
      return item.provider?.order_item?.product?.nama || 'N/A'
    },
    getCategoryName(item) {
      return item.provider?.order_item?.product?.category?.nama || 'N/A'
    },
  },
}
</script>

<style scoped>
.detail-delivery-order-container {
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

.detail-form {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 1.2em;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #f9f9f9;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
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

.items-table tbody tr:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .items-table {
    font-size: 0.9em;
  }

  .items-table th,
  .items-table td {
    padding: 8px 12px;
  }
}
</style>
