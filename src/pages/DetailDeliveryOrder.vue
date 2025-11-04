<template>
  <div class="detail-delivery-order-container">
    <div class="top-bar">
      <h2>Detail Delivery Order</h2>
      <div class="top-buttons">
        <button class="print-btn" @click="printPDF">Print PDF</button>
        <button class="back-btn" @click="$router.go(-1)">← Kembali</button>
      </div>
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
            <input v-model="picDelivery" type="text" readonly class="form-control" />
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
            <input v-model="deliveryOrder.no_do" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>PIC Delivery</label>
            <input v-model="deliveryOrder.pic" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>Tanggal Delivery</label>
            <input v-model="formattedDeliveryDate" type="text" readonly class="form-control" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <span :class="getStatusClass(status)" class="status-badge">{{
              getStatusText(status)
            }}</span>
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
              <th>Quantity Received</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in deliveryOrder.delivery_order_items" :key="item.id">
              <td>{{ getProductName(item) }}</td>
              <td>{{ getCategoryName(item) }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <input
                  type="number"
                  v-model.number="item.quantity_received"
                  placeholder="0"
                  class="received-input"
                  min="0"
                  :max="item.quantity"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes Section -->
      <div class="form-section">
        <h3>Keterangan</h3>
        <div class="form-group">
          <textarea
            v-model="notes"
            placeholder="Masukkan keterangan..."
            class="notes-textarea"
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="updateReceiver" class="update-btn" :disabled="status === 'closed'">
          {{ existingReceive ? 'Update Receiver' : 'Create Receiver' }}
        </button>
        <button
          v-if="existingReceive"
          @click="closeOrder"
          class="close-btn"
          :disabled="status === 'closed'"
        >
          Close Order
        </button>
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
import api from '@/user/axios.js'
import { useLoadingStore } from '@/stores/loading.js'
import jsPDF from 'jspdf'

export default {
  name: 'DetailDeliveryOrder',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      deliveryOrder: null,
      showToast: false,
      message_toast: '',
      isLoading: false,
      notes: '',
      status: 'open', // Default status
      existingReceive: null, // Store existing receive data if any
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
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
  methods: {
    async fetchDeliveryOrderDetail() {
      this.loadingStore.show()
      try {
        const orderId = this.$route.params.id
        const response = await api.get(`${BASE_URL}delivery-orders/${orderId}`)
        if (response.data.status) {
          this.deliveryOrder = response.data.data
          this.status = this.deliveryOrder.status || 'open'

          // Check if receives exist and set existingReceive
          if (this.deliveryOrder.receives && this.deliveryOrder.receives.length > 0) {
            this.existingReceive = this.deliveryOrder.receives[0] // Take the first receive
            this.notes = this.existingReceive.keterangan || ''

            // Pre-populate quantity_received from existing receive items
            this.deliveryOrder.delivery_order_items.forEach((item) => {
              const receiveItem = this.existingReceive.receive_items.find(
                (ri) => ri.delivery_order_items_id === item.id,
              )
              if (receiveItem) {
                item.quantity_received = receiveItem.quantity
              } else if (item.quantity_received === undefined || item.quantity_received === null) {
                item.quantity_received = item.quantity
              }
            })
          } else {
            // No existing receives, set defaults
            this.deliveryOrder.delivery_order_items.forEach((item) => {
              if (item.quantity_received === undefined || item.quantity_received === null) {
                item.quantity_received = item.quantity
              }
            })
          }
        } else {
          this.message_toast = 'Gagal mengambil detail delivery order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching delivery order detail:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil detail delivery order'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
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
    getStatusClass(status) {
      switch (status) {
        case 'closed':
          return 'status-closed'
        case 'open':
          return 'status-open'
        default:
          return 'status-open'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'closed':
          return 'Closed'
        case 'open':
          return 'Open'
        default:
          return 'Open'
      }
    },
    async updateReceiver() {
      this.loadingStore.show()
      try {
        const picName = localStorage.getItem('username')
        const currentDate = new Date().toISOString().split('T')[0]

        if (this.existingReceive) {
          // Update existing receive
          const payload = {
            pic: picName,
            tanggal: currentDate,
            keterangan: this.notes,
            items: this.deliveryOrder.delivery_order_items.map((item) => ({
              delivery_order_items_id: item.id,
              quantity: item.quantity_received || 0,
              pic: picName,
              tanggal: currentDate,
            })),
          }

          const response = await api.put(`${BASE_URL}receives/${this.existingReceive.id}`, payload)
          console.log('Update payload Receive:', payload)
          if (response.data.status) {
            this.message_toast = 'Receiver updated successfully'
            this.showToast = true
            // Refresh data after update
            await this.fetchDeliveryOrderDetail()
          } else {
            this.message_toast = 'Failed to update receiver'
            this.showToast = true
          }
        } else {
          // Create new receive
          const payload = {
            delivery_order_id: this.deliveryOrder.id,
            pic: picName,
            tanggal: currentDate,
            keterangan: this.notes,
            items: this.deliveryOrder.delivery_order_items.map((item) => ({
              delivery_order_items_id: item.id,
              quantity: item.quantity_received || 0,
              pic: picName,
              tanggal: currentDate,
            })),
          }

          const response = await api.post(`${BASE_URL}receives/new`, payload)
          console.log('Create payload Receive:', payload)
          if (response.data.status) {
            this.message_toast = 'Receiver created successfully'
            this.showToast = true
            // Refresh data after creation
            await this.fetchDeliveryOrderDetail()
          } else {
            this.message_toast = 'Failed to create receiver'
            this.showToast = true
          }
        }
      } catch (error) {
        console.error('Error with receiver:', error)
        this.message_toast = `Error ${this.existingReceive ? 'updating' : 'creating'} receiver`
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    async closeOrder() {
      this.loadingStore.show()
      try {
        const response = await api.post(
          `${BASE_URL}delivery-orders/${this.deliveryOrder.id}/close`,
          {
            pic: localStorage.getItem('username'),
          },
        )

        if (response.data.status) {
          this.status = 'closed'
          this.message_toast = 'Order closed successfully'
          this.showToast = true
          // Navigate back after success
          setTimeout(() => {
            this.$router.push('/delivery/orders')
          }, 2000)
        } else {
          this.message_toast = 'Failed to close order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error closing order:', error)
        this.message_toast = 'Error closing order'
        this.showToast = true
      } finally {
        this.loadingStore.hide()
      }
    },
    printPDF() {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 30

      // Header with logo placeholder
      doc.setFillColor(70, 130, 180) // Steel blue
      doc.rect(0, 0, pageWidth, 25, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('DELIVERY ORDER', pageWidth / 2, 15, { align: 'center' })
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      const outletName =
        this.deliveryOrder?.delivery_order_items?.[0]?.provider?.order_item?.order?.outlet_name ||
        'N/A'
      doc.text(`To: ${outletName}`, pageWidth / 2, 22, { align: 'center' })

      // Company info placeholder
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('PT. Garuda Mas Cemerlang', 20, 35)
      doc.text('Jl. Golden BCI Ruko E1 03, Jakarta', 20, 40)

      yPosition = 55

      // Order Details Box
      doc.setDrawColor(70, 130, 180)
      doc.setLineWidth(0.5)
      doc.roundedRect(15, yPosition, pageWidth - 30, 40, 3, 3, 'S')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDER INFORMATION', 20, yPosition + 8)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Order No: ${this.orderNo}`, 25, yPosition + 16)
      doc.text(`PIC Orders: ${this.picDelivery}`, 25, yPosition + 23)
      doc.text(`Date: ${this.formattedDate}`, 25, yPosition + 30)
      doc.text(`Delivery Order No: ${this.deliveryOrder.no_do}`, 120, yPosition + 16)
      doc.text(`PIC Delivery: ${this.deliveryOrder.pic}`, 120, yPosition + 23)
      doc.text(`Delivery Date: ${this.formattedDeliveryDate}`, 120, yPosition + 30)
      yPosition += 55

      // Items Table
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('DELIVERED ITEMS', 20, yPosition)
      yPosition += 10

      // Table Header
      doc.setFillColor(240, 248, 255) // Alice blue
      doc.rect(15, yPosition - 5, pageWidth - 30, 10, 'F')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('No', 20, yPosition)
      doc.text('Product Name', 35, yPosition)
      doc.text('Category', 120, yPosition)
      doc.text('Quantity', 170, yPosition)
      yPosition += 10

      // Table Rows
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      this.deliveryOrder.delivery_order_items.forEach((item, index) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage()
          yPosition = 30
        }
        doc.text(`${index + 1}`, 20, yPosition)
        doc.text(this.getProductName(item), 35, yPosition)
        doc.text(this.getCategoryName(item), 120, yPosition)
        doc.text(item.quantity.toString(), 170, yPosition)
        yPosition += 7
      })
      yPosition += 5

      // Signature Section
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 5
      }

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('KETERANGAN/NOTES', 20, yPosition)
      yPosition += 2

      // Signature note box
      doc.setDrawColor(70, 130, 180)
      doc.setLineWidth(0.5)
      doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, 'S')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')

      yPosition += 15

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('SIGNATURES', 20, yPosition)
      yPosition += 5

      // Signature boxes with labels
      const boxWidth = 40
      const boxHeight = 20
      const boxY = yPosition

      // PIC Order
      doc.setDrawColor(70, 130, 180)
      doc.setLineWidth(0.8)
      doc.rect(20, boxY, boxWidth, boxHeight)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(this.picDelivery || 'PIC Order', 20, boxY - 2)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(6)
      doc.text('(Order Creator)', 20, boxY + boxHeight + 3)

      // PIC Delivery
      doc.rect(75, boxY, boxWidth, boxHeight)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(this.deliveryOrder.pic || 'PIC Delivery', 75, boxY - 2)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(6)
      doc.text('(Delivery Person)', 75, boxY + boxHeight + 3)

      // Penerima
      doc.rect(130, boxY, boxWidth, boxHeight)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('PENERIMA', 130, boxY - 2)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(6)
      doc.text('(Receiver)', 130, boxY + boxHeight + 3)

      // Footer
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      doc.text(
        'This document is generated electronically and is valid without signature.',
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' },
      )
      doc.text(
        `Generated on: ${new Date().toLocaleDateString('id-ID')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' },
      )

      // Save the PDF
      doc.save(`Delivery_Order_${this.deliveryOrder.no_do || 'Detail'}.pdf`)
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

.top-buttons {
  display: flex;
  gap: 10px;
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

.print-btn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.print-btn:hover {
  background: #218838;
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

.received-input {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 80px;
  font-size: 0.9em;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

.update-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.update-btn:hover:not(:disabled) {
  background: #0056b3;
}

.close-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.close-btn:hover:not(:disabled) {
  background: #c82333;
}

.close-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.update-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.notes-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.notes-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.status-open {
  background: #d4edda;
  color: #155724;
}

.status-closed {
  background: #f8d7da;
  color: #721c24;
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
