<template>
  <div class="edit-order-form">
    <h2>Edit Order - {{ orderData.no_order }}</h2>
    <form @submit.prevent="submitEditOrder">
      <div class="form-grid">
        <div class="form-group">
          <label>Tanggal Waktu</label>
          <input v-model="tanggal" type="text" readonly class="form-control" />
        </div>
        <div class="form-group">
          <label>Nama Outlet</label>
          <input v-model="outlet_name" type="text" readonly class="form-control" />
        </div>
        <div class="form-group">
          <label>Nama PIC</label>
          <input v-model="pic_name" type="text" readonly class="form-control" />
        </div>
        <div class="form-group full-width">
          <label>Keterangan (Opsional)</label>
          <textarea
            v-model="keterangan"
            placeholder="Tambahkan keterangan jika diperlukan"
            class="form-control"
          ></textarea>
        </div>
      </div>
      <div class="items-section">
        <h3>Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Disediakan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.productNameQuery }}
              </td>
              <td>
                {{ item.quantity }}
              </td>
              <td>
                <input
                  v-if="!item.provider_id"
                  v-model.number="item.quantity_provider"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="Masukkan jumlah"
                />
                <span v-else>{{ item.quantity_provider || 0 }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    v-if="!item.provider_id"
                    type="button"
                    @click="createSingleProvider(item)"
                    class="keep-btn"
                  >
                    Provide
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="$router.push('/order/list')">Batal</button>
        <button
          type="button"
          class="multi-provider-btn"
          @click="createMultiProvider"
          :disabled="hasAnyProvider"
        >
          Create Multi Provider
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitDisabled">
          Create Delivery Order
        </button>
      </div>
    </form>
    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay />
  </div>
</template>

<script>
import axios from 'axios'
import ToastCard from './ToastCard.vue'
import LoadingOverlay from './LoadingOverlay.vue'
import { BASE_URL } from '../base.utils.url'
import { useLoadingStore } from '@/stores/loading'
import api from '@/user/axios'

export default {
  name: 'EditOrderForm',
  components: { ToastCard, LoadingOverlay },
  props: {},
  data() {
    return {
      orderId: null,
      orderData: {},
      outlet_name: '',
      pic_name: '',
      tanggal: '',
      keterangan: '',
      items: [], // Start with empty array
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  mounted() {
    this.orderId = this.$route.params.id
    this.fetchOrderDetail()
  },
  computed: {
    isSubmitDisabled() {
      return this.items.some((item) => !item.provider_id)
    },
    hasAnyProvider() {
      return this.items.some((item) => item.provider_id)
    },
  },
  methods: {
    async fetchOrderDetail() {
      this.loadingStore.show()
      try {
        const response = await axios.get(`${BASE_URL}orders/${this.orderId}`)
        if (response.data.status) {
          this.orderData = response.data.data
          this.outlet_name = this.orderData.outlet_name
          this.pic_name = this.orderData.pic_name
          this.tanggal = this.formatDateTime(this.orderData.tanggal)
          this.keterangan = this.orderData.keterangan || ''

          // Populate items from order_items
          this.items = this.orderData.order_items.map((item) => ({
            id: item.id, // Add order_items_id
            product_id: item.product_id,
            outlet_id: item.outlet_id,
            quantity: item.quantity,
            quantity_provider: item.quantity_provider || item.quantity,
            pic: item.pic,
            provider_id: item.provider_id,
            productNameQuery: item.product.nama,
            suggestions: [],
            showSuggestions: false,
          }))

          // If no items, add empty one
          if (this.items.length === 0) {
            this.items = [
              {
                product_id: '',
                provider_id: '',
                outlet_id: localStorage.getItem('outlet_id') || '',
                quantity: 1,
                pic: localStorage.getItem('username') || '',
                productNameQuery: '',
                suggestions: [],
                showSuggestions: false,
              },
            ]
          }

          console.log('Data Order: ', response.data)
        } else {
          this.message_toast = 'Gagal mengambil detail order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching order detail:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil detail order'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async createSingleProvider(item) {
      this.loadingStore.show()
      try {
        // First, fill stock by calling products/moving/income endpoint
        const stockPayload = {
          product_id: item.product_id,
          outlet_id: item.outlet_id,
          quantity: item.quantity_provider,
          type: 'income',
          tanggal: new Date().toISOString().split('T')[0], // Current date
          pic: localStorage.getItem('username'),
          keterangan: 'Stock replenishment before provider creation for order_item_id ' + item.id,
        }
        const stockResponse = await api.post(`${BASE_URL}products/moving`, stockPayload)

        if (!stockResponse.data.status) {
          throw new Error('Failed to fill stock')
        }
        console.log('Stock Replenishment Response: ', stockResponse.data)

        const payload = {
          order_items_id: item.id,
          quantity: item.quantity_provider,
          tanggal: new Date().toISOString().split('T')[0], // Current date
          pic: localStorage.getItem('username'),
        }

        console.log('Payload Single Provider: ', payload)
        const response = await api.post(`${BASE_URL}orders/providers/single`, payload)
        if (response.data.status) {
          this.message_toast = 'Single provider berhasil dibuat'
          this.showToast = true
          // Refresh order details after successful creation
          await this.fetchOrderDetail()
        } else {
          throw new Error('Failed to create single provider')
        }
      } catch (error) {
        console.error('Error creating single provider:', error)
        this.message_toast = 'Gagal membuat single provider'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    async createMultiProvider() {
      this.loadingStore.show()
      try {
        // First, fill stock by calling products/moving/multi/income endpoint
        const itemsToProvide = this.items.filter((item) => !item.provider_id)
        const products = itemsToProvide.map((item) => ({
          product_id: item.product_id,
          outlet_id: item.outlet_id,
          type: 'income',
          quantity: item.quantity_provider || item.quantity,
          tanggal: new Date().toISOString().split('T')[0], // Current date
          pic: localStorage.getItem('username'),
          keterangan: 'Stock replenishment before provider creation for order_item_id ' + item.id,
        }))
        const stockPayload = { products }
        const stockResponse = await api.post(`${BASE_URL}products/moving/multi`, stockPayload)
        if (!stockResponse.data.status) {
          throw new Error('Failed to fill stock')
        }

        const providers = itemsToProvide.map((item) => ({
          order_items_id: item.id,
          quantity: item.quantity_provider || item.quantity,
          tanggal: new Date().toISOString().split('T')[0], // Current date
          pic: localStorage.getItem('username'),
        }))

        const payload = { providers }
        console.log('Payload Multi Provider: ', payload)
        const response = await api.post(`${BASE_URL}orders/providers/multi`, payload)
        if (response.data.status) {
          this.message_toast = 'Multi provider berhasil dibuat'
          this.showToast = true
          // Refresh order details after successful creation
          await this.fetchOrderDetail()
        } else {
          throw new Error('Failed to create multi provider')
        }
      } catch (error) {
        console.error('Error creating multi provider:', error)
        this.message_toast = 'Gagal membuat multi provider'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    async submitEditOrder() {
      this.loadingStore.show()
      try {
        // Collect data from items array
        const orderData = {
          order_id: this.orderId,
          keterangan: this.keterangan,
          pic: localStorage.getItem('username'),
          items: this.items.map((item) => ({
            product_id: parseInt(item.product_id),
            outlet_id: parseInt(item.outlet_id),
            quantity: item.quantity_provider || item.quantity,
            pic: item.pic,
            provider_id: item.provider_id,
          })),
        }
        console.log('Create Delivery Order Data:', orderData)
        const response = await api.post(`${BASE_URL}delivery-orders/new`, orderData)
        this.message_toast = response.data.message || 'Delivery Order berhasil dibuat'
        this.showToast = true
        setTimeout(() => {
          this.$router.push('/order/list')
        }, 2000)
      } catch (error) {
        console.error('Error updating order:', error)
        this.message_toast = 'Failed to create delivery order. Please try again.'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
.edit-order-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.full-width {
  grid-column: span 2;
}
.form-group {
  margin-bottom: 16px;
}
.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
textarea.form-control {
  resize: vertical;
  min-height: 80px;
}
.items-section {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.cancel-btn {
  background: #9e9e9e;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #757575;
}
.submit-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}
.submit-btn:hover:not(:disabled) {
  background: #1976d2;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table th,
.items-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.items-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.items-table td input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.keep-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  margin-left: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.keep-btn:hover {
  background: linear-gradient(135deg, #45a049, #4caf50);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.multi-provider-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.multi-provider-btn:hover:not(:disabled) {
  background: #1976d2;
}

.multi-provider-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
