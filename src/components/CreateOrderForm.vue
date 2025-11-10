<template>
  <div class="create-order-form">
    <h2>Create Order</h2>
    <form @submit.prevent="submitOrder">
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
        <ItemCard
          v-for="(item, index) in items"
          :key="index"
          ref="itemCards"
          @remove-item="removeItem(index)"
        />
        <button type="button" @click="addItem" class="add-item-btn">+ Add Item</button>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit Order</button>
      </div>
    </form>
    <ToastCard v-if="showToast" :message_toast="message_toast" @close="tutupToast" />
    <LoadingOverlay />
  </div>
</template>

<script>
import axios from 'axios'
import ItemCard from './ItemCard.vue'
import ToastCard from './ToastCard.vue'
import LoadingOverlay from './LoadingOverlay.vue'
import { BASE_URL } from '../base.utils.url.ts'
import { useLoadingStore } from '@/stores/loading'
import api from '@/user/axios'

export default {
  name: 'CreateOrderForm',
  components: { ItemCard, ToastCard, LoadingOverlay },
  data() {
    return {
      outlet_id: '',
      user_id: '',
      outlet_name: '',
      pic_name: '',
      tanggal: '',
      keterangan: '',
      items: [{}], // Start with one item
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
    this.outlet_id = localStorage.getItem('outlet_id') || ''
    this.user_id = localStorage.getItem('user_id') || ''
    this.pic_name = localStorage.getItem('username') || ''
    this.tanggal = this.getCurrentDateTimeIndonesia()
    this.role_id = parseInt(localStorage.getItem('role_id'))
    this.fetchOutletName()
  },
  methods: {
    async fetchOutletName() {
      const outletId = localStorage.getItem('outlet_id')
      if (!outletId) return
      try {
        const response = await axios.get(`${BASE_URL}outlets/${outletId}`)
        this.outlet_name = response.data.data.nama
      } catch (error) {
        console.error('Error fetching outlet:', error)
      }
    },
    getCurrentDateTimeIndonesia() {
      const now = new Date()
      const indonesiaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000) // UTC+7
      return indonesiaTime.toISOString().slice(0, 19).replace('T', ' ')
    },
    addItem() {
      this.items.push({})
    },
    removeItem(index) {
      this.items.splice(index, 1)
    },
    async submitOrder() {
      this.loadingStore.show()
      try {
        // Collect data from itemCards
        const orderData = {
          outlet_id: parseInt(this.outlet_id),
          user_id: parseInt(this.user_id),
          outlet_name: this.outlet_name,
          pic_name: this.pic_name,
          tanggal: this.tanggal,
          keterangan: this.keterangan,
          items: this.$refs.itemCards.map((card) => ({
            product_id: parseInt(card.product_id),
            outlet_id: parseInt(card.outlet_id),
            quantity: card.quantity,
            pic: card.pic,
          })),
        }
        console.log('Order Data:', orderData)
        const response = await api.post(`${BASE_URL}orders/new`, orderData)
        this.showToast = true
        this.message_toast = response.data.message

        // Reset form or redirect
        this.items = [{}]
      } catch (error) {
        console.error('Error submitting order:', error)
        this.showToast = true
        this.message_toast = 'Failed to submit order. Please try again.'
      } finally {
        this.loadingStore.hide()
      }
    },
    tutupToast() {
      this.showToast = false
      window.location.reload()
      this.items = [{}]
      setTimeout(() => {
        if (this.role_id === 2 || this.role_id === 3) {
          this.$router.push('/order/list')
          return
        } else {
          this.$router.push('/order/all')
        }
      }, 2000)
    },
  },
}
</script>

<style scoped>
.create-order-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive form grid */
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
  box-sizing: border-box;
}

.items-section {
  margin-bottom: 20px;
}

.add-item-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-size: 16px;
}

.add-item-btn:hover {
  background: #45a049;
}

.form-actions {
  text-align: center;
}

.submit-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.submit-btn:hover {
  background: #1976d2;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .create-order-form {
    padding: 16px;
    margin: 0 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .full-width {
    grid-column: span 1;
  }

  .form-control {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 10px 12px;
  }

  .add-item-btn,
  .submit-btn {
    padding: 12px 16px;
    font-size: 16px;
  }

  .items-section h3 {
    font-size: 1.2em;
  }
}

@media (max-width: 480px) {
  .create-order-form {
    padding: 12px;
    margin: 0 5px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-control {
    padding: 12px;
  }

  .add-item-btn,
  .submit-btn {
    padding: 14px 16px;
    font-size: 16px;
  }
}
</style>
