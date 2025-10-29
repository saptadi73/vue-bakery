<template>
  <div class="receives-container">
    <div class="top-bar">
      <h2>Daftar Receives</h2>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari receive..." class="search-input" />
    </div>
    <!-- Tabel untuk desktop -->
    <table class="receives-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>No. Receive</th>
          <th>Delivery Order No</th>
          <th>PIC</th>
          <th>Tanggal</th>
          <th>Jumlah Items</th>
          <th>Total Quantity</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="receive in filteredReceives"
          :key="receive.id"
          @click="viewDetail(receive.id)"
          class="clickable-row"
        >
          <td>{{ receive.no_rec }}</td>
          <td>{{ receive.delivery_order?.no_do }}</td>
          <td>{{ receive.pic }}</td>
          <td>{{ formatDate(receive.tanggal) }}</td>
          <td>{{ receive.receive_items.length }}</td>
          <td>{{ getTotalQuantity(receive.receive_items) }}</td>
          <td>{{ receive.keterangan || '-' }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="receives-card-list" v-if="isMobile">
      <div
        v-for="receive in filteredReceives"
        :key="receive.id"
        class="receives-card"
        @click="viewDetail(receive.id)"
      >
        <div class="receive-info">
          <div class="receive-no">{{ receive.no_rec }}</div>
          <div class="receive-do">DO: {{ receive.delivery_order?.no_do }}</div>
          <div class="receive-pic">PIC: {{ receive.pic }}</div>
          <div class="receive-date">{{ formatDate(receive.tanggal) }}</div>
          <div class="receive-items">Items: {{ receive.receive_items.length }}</div>
          <div class="receive-total">Total Qty: {{ getTotalQuantity(receive.receive_items) }}</div>
          <div class="receive-ket" v-if="receive.keterangan">Ket: {{ receive.keterangan }}</div>
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
  name: 'TableReceives',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      receives: [],
      searchQuery: '',
      isMobile: false,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  computed: {
    filteredReceives() {
      if (!this.searchQuery) return this.receives
      return this.receives.filter(
        (receive) =>
          receive.no_rec.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          receive.delivery_order?.no_do.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          receive.pic.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          receive.keterangan?.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchReceives()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchReceives() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}receives/list`)
        if (response.data.status) {
          this.receives = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data receives'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching receives:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data receives'
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
    viewDetail(receiveId) {
      this.$router.push(`/delivery/receives/${receiveId}`)
    },
  },
}
</script>

<style scoped>
.receives-container {
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

.receives-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.receives-table th,
.receives-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.receives-table th {
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

/* Mobile styles */
.receives-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.receives-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.receives-card:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.receive-info {
  flex: 1;
}

.receive-no {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.receive-pic,
.receive-date,
.receive-items,
.receive-total,
.receive-ket {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .receives-table {
    display: none;
  }
  .receives-card-list {
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
  .receives-card-list {
    display: none;
  }
}
</style>
