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
        <ItemCard
          v-for="(item, index) in items"
          :key="index"
          ref="itemCards"
          :initialProductId="item.product_id"
          :initialOutletId="item.outlet_id"
          :initialQuantity="item.quantity"
          :initialPic="item.pic"
          :initialProductName="item.productNameQuery"
          :initialCategoryName="item.categoryQuery"
          @remove-item="removeItem(index)"
        />
        <button type="button" @click="addItem" class="add-item-btn">+ Add Item</button>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="$router.push('/order/list')">Batal</button>
        <button type="submit" class="submit-btn">Update Order</button>
      </div>
    </form>
    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import ItemCard from './ItemCard.vue'
import ToastCard from './ToastCard.vue'
import LoadingOverlay from './LoadingOverlay.vue'
import { BASE_URL } from '../base.utils.url.ts'
import api from '@/user/axios'

export default {
  name: 'EditOrderForm',
  components: { ItemCard, ToastCard, LoadingOverlay },
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
  mounted() {
    this.orderId = this.$route.params.id
    this.fetchOrderDetail()
  },
  methods: {
    async fetchOrderDetail() {
      this.isLoading = true
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
            product_id: item.product_id,
            outlet_id: item.outlet_id,
            quantity: item.quantity,
            pic: item.pic,
            productNameQuery: item.product.nama,
            categoryQuery: item.product.category ? item.product.category.nama : '',
          }))

          // If no items, add empty one
          if (this.items.length === 0) {
            this.items = [{}]
          }
        } else {
          this.message_toast = 'Gagal mengambil detail order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching order detail:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil detail order'
        this.showToast = true
      } finally {
        this.isLoading = false
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
    addItem() {
      this.items.push({})
    },
    removeItem(index) {
      this.items.splice(index, 1)
    },
    async submitEditOrder() {
      this.isLoading = true
      try {
        // Collect data from itemCards
        const orderData = {
          keterangan: this.keterangan,
          items: this.$refs.itemCards.map((card) => ({
            product_id: parseInt(card.product_id),
            outlet_id: parseInt(card.outlet_id),
            quantity: card.quantity,
            pic: card.pic,
          })),
        }
        console.log('Update Order Data:', orderData)
        const response = await api.put(`${BASE_URL}orders/${this.orderId}`, orderData)
        this.message_toast = response.data.message || 'Order berhasil diupdate'
        this.showToast = true
        setTimeout(() => {
          this.$router.push('/order/list')
        }, 2000)
      } catch (error) {
        console.error('Error updating order:', error)
        this.message_toast = 'Failed to update order. Please try again.'
        this.showToast = true
      } finally {
        this.isLoading = false
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
.add-item-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
}
.add-item-btn:hover {
  background: #45a049;
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
.submit-btn:hover {
  background: #1976d2;
}
</style>
