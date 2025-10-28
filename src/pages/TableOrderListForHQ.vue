<template>
  <div class="order-list-container">
    <div class="top-bar">
      <h2>Daftar Order</h2>
      <div class="top-actions">
        <button class="refresh-btn" @click="fetchOrders" :disabled="isLoading">
          <font-awesome-icon :icon="['fas', 'sync-alt']" />
        </button>
        <button class="export-btn" @click="exportToCSV" :disabled="!filteredOrders.length">
          <font-awesome-icon :icon="['fas', 'download']" />
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan No. Order, PIC Name, atau Outlet Name..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Semua Status</option>
          <option value="new">New</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
        <input v-model="dateFrom" type="date" class="date-input" placeholder="Dari Tanggal" />
        <input v-model="dateTo" type="date" class="date-input" placeholder="Sampai Tanggal" />
        <button class="clear-filters-btn" @click="clearFilters">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>

    <!-- Summary Info -->
    <div class="summary-info">
      <span>Total Orders: {{ totalOrders }}</span>
      <span v-if="filteredOrders.length !== totalOrders"
        >Filtered: {{ filteredOrders.length }}</span
      >
    </div>
    <!-- Tabel untuk desktop -->
    <table class="order-table" v-if="!isMobile">
      <thead>
        <tr>
          <th @click="sortBy('no_order')" class="sortable-header">
            No. Order
            <font-awesome-icon :icon="getSortIcon('no_order')" class="sort-icon" />
          </th>
          <th @click="sortBy('tanggal')" class="sortable-header">
            Tanggal
            <font-awesome-icon :icon="getSortIcon('tanggal')" class="sort-icon" />
          </th>
          <th @click="sortBy('pic_name')" class="sortable-header">
            PIC Name
            <font-awesome-icon :icon="getSortIcon('pic_name')" class="sort-icon" />
          </th>
          <th @click="sortBy('outlet_name')" class="sortable-header" style="width: 15%">
            Outlet Name
            <font-awesome-icon :icon="getSortIcon('outlet_name')" class="sort-icon" />
          </th>
          <th @click="sortBy('status_order')" class="sortable-header" style="width: 12%">
            Status Order
            <font-awesome-icon :icon="getSortIcon('status_order')" class="sort-icon" />
          </th>
          <th style="width: 18%">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.id" class="table-row">
          <td>{{ order.no_order }}</td>
          <td>{{ formatDate(order.tanggal) }}</td>
          <td>{{ order.pic_name }}</td>
          <td>{{ order.outlet_name }}</td>
          <td>
            <span :class="getStatusClass(order.status_order)" class="status-badge">
              {{ order.status_order }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button
                v-if="order.status_order === 'new'"
                class="edit-btn"
                @click="editOrder(order)"
                title="Edit Order"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
              <button
                v-if="order.status_order === 'new'"
                class="delivery-btn"
                @click="createDelivery(order)"
                title="Create Delivery"
              >
                <font-awesome-icon :icon="['fas', 'truck']" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="!paginatedOrders.length && !isLoading" class="empty-state">
      <font-awesome-icon :icon="['fas', 'inbox']" class="empty-icon" />
      <h3>Tidak ada data order</h3>
      <p>Coba ubah filter pencarian atau refresh halaman</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn">
        <font-awesome-icon :icon="['fas', 'angle-double-left']" />
      </button>
      <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>

      <span class="page-info"> Halaman {{ currentPage }} dari {{ totalPages }} </span>

      <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
        <font-awesome-icon :icon="['fas', 'angle-right']" />
      </button>
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        <font-awesome-icon :icon="['fas', 'angle-double-right']" />
      </button>

      <select v-model="itemsPerPage" @change="currentPage = 1" class="items-select">
        <option :value="10">10 per halaman</option>
        <option :value="25">25 per halaman</option>
        <option :value="50">50 per halaman</option>
        <option :value="100">100 per halaman</option>
      </select>
    </div>
    <!-- Card untuk mobile -->
    <div class="order-card-list" v-if="isMobile">
      <div v-for="order in paginatedOrders" :key="order.id" class="order-card">
        <div class="order-info">
          <div class="order-no">{{ order.no_order }}</div>
          <div class="order-date">{{ formatDate(order.tanggal) }}</div>
          <div class="order-pic">PIC: {{ order.pic_name }}</div>
          <div class="order-outlet">Outlet: {{ order.outlet_name }}</div>
          <div class="order-status">
            <span :class="getStatusClass(order.status_order)" class="status-badge">
              {{ order.status_order }}
            </span>
          </div>
        </div>
        <div class="order-actions">
          <button
            v-if="order.status_order === 'new'"
            class="edit-btn"
            @click="editOrder(order)"
            title="Edit Order"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
          <button
            v-if="order.status_order === 'new'"
            class="delivery-btn"
            @click="createDelivery(order)"
            title="Create Delivery"
          >
            <font-awesome-icon :icon="['fas', 'truck']" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Pagination -->
    <div v-if="isMobile && totalPages > 1" class="mobile-pagination">
      <button @click="currentPage--" :disabled="currentPage === 1" class="mobile-page-btn">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <span class="mobile-page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages" class="mobile-page-btn">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>

    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'

export default {
  name: 'TableOrderList',
  components: { ToastCard, LoadingOverlay },
  data() {
    return {
      orders: [],
      searchQuery: '',
      statusFilter: '',
      dateFrom: '',
      dateTo: '',
      sortByField: 'tanggal',
      sortDirection: 'desc',
      currentPage: 1,
      itemsPerPage: 10,
      isMobile: false,
      showToast: false,
      message_toast: '',
      isLoading: false,
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders

      // Search filter
      if (this.searchQuery) {
        filtered = filtered.filter(
          (order) =>
            order.no_order.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            order.pic_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            order.outlet_name.toLowerCase().includes(this.searchQuery.toLowerCase()),
        )
      }

      // Status filter
      if (this.statusFilter) {
        filtered = filtered.filter((order) => order.status_order === this.statusFilter)
      }

      // Date range filter
      if (this.dateFrom) {
        const fromDate = new Date(this.dateFrom)
        filtered = filtered.filter((order) => new Date(order.tanggal) >= fromDate)
      }
      if (this.dateTo) {
        const toDate = new Date(this.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        filtered = filtered.filter((order) => new Date(order.tanggal) <= toDate)
      }

      // Sorting
      filtered.sort((a, b) => {
        let aVal = a[this.sortByField]
        let bVal = b[this.sortByField]

        if (this.sortByField === 'tanggal') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })

      return filtered
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    },
    totalOrders() {
      return this.orders.length
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchOrders()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    sortBy(field) {
      if (this.sortByField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortByField = field
        this.sortDirection = 'asc'
      }
      this.currentPage = 1 // Reset to first page when sorting
    },
    getSortIcon(field) {
      if (this.sortByField !== field) return ['fas', 'sort']
      return this.sortDirection === 'asc' ? ['fas', 'sort-up'] : ['fas', 'sort-down']
    },
    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.dateFrom = ''
      this.dateTo = ''
      this.currentPage = 1
    },
    exportToCSV() {
      const headers = ['No. Order', 'Tanggal', 'PIC Name', 'Outlet Name', 'Status Order']
      const csvContent = [
        headers.join(','),
        ...this.filteredOrders.map((order) =>
          [
            `"${order.no_order}"`,
            `"${this.formatDate(order.tanggal)}"`,
            `"${order.pic_name}"`,
            `"${order.outlet_name}"`,
            `"${order.status_order}"`,
          ].join(','),
        ),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    async fetchOrders() {
      this.isLoading = true
      try {
        const outletId = localStorage.getItem('outlet_id')
        if (!outletId) {
          this.message_toast = 'Outlet ID tidak ditemukan'
          this.showToast = true
          return
        }
        const response = await axios.get(`${BASE_URL}orders/list-all`)
        if (response.data.status) {
          this.orders = response.data.data
          this.currentPage = 1 // Reset to first page when data is refreshed
        } else {
          this.message_toast = 'Gagal mengambil data order'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data order'
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
      }
      return classes[status] || 'status-default'
    },
    editOrder(order) {
      this.$router.push(`/order/edit/${order.id}`)
    },
    createDelivery(order) {
      this.$router.push(`/delivery/create/${order.id}`)
    },
  },
}
</script>

<style scoped>
.order-list-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.top-bar h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.top-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn,
.export-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled),
.export-btn:hover:not(:disabled) {
  background: #1976d2;
  transform: translateY(-1px);
}

.refresh-btn:disabled,
.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.filters-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 200px;
}

.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 100%;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
}

.filter-select,
.date-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  min-width: 120px;
  transition: border-color 0.2s;
}

.filter-select:focus,
.date-input:focus {
  outline: none;
  border-color: #2196f3;
}

.clear-filters-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.clear-filters-btn:hover {
  background: #d32f2f;
}

.summary-info {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-table th,
.order-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  border: none;
  padding: 14px 12px;
  text-align: left;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  vertical-align: middle;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sort-icon {
  margin-left: 8px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.table-row:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
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
  background: #fff3e0;
  color: #f57c00;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.edit-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #1976d2;
}

.delete-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
}

.delete-btn:hover {
  background: #d32f2f;
}

/* Mobile styles */
.order-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.order-date,
.order-pic,
.order-outlet {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 2px;
}

.order-status {
  margin-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}

@media (max-width: 768px) {
  .order-table {
    display: none;
  }
  .order-card-list {
    display: flex;
  }
  .top-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  .top-actions {
    width: 100%;
    justify-content: center;
  }
  .filters-section {
    padding: 12px;
  }
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .search-bar {
    min-width: unset;
  }
  .filter-select,
  .date-input {
    min-width: unset;
    width: 100%;
  }
  .summary-info {
    flex-direction: column;
    gap: 8px;
  }
  .order-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .edit-btn,
  .delivery-btn {
    justify-content: center;
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  .pagination {
    padding: 12px;
    gap: 4px;
  }
  .page-info {
    margin: 0 8px;
    font-size: 0.8rem;
  }
  .items-select {
    margin-left: 8px;
  }
}

@media (min-width: 769px) {
  .order-card-list {
    display: none;
  }
}

/* Modal styles */
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
  padding: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 16px;
  color: #333;
}

.modal-content p {
  margin-bottom: 24px;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel-btn {
  background: #9e9e9e;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #757575;
}

.delete-confirm-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.delete-confirm-btn:hover {
  background: #d32f2f;
}

.delivery-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.8em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.delivery-btn:hover {
  background: linear-gradient(135deg, #45a049, #4caf50);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.delivery-btn i {
  font-size: 0.9em;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.empty-state p {
  color: #999;
  font-size: 0.9rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.page-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.page-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.page-info {
  margin: 0 16px;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.items-select {
  margin-left: 16px;
  padding: 6px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.8rem;
  background: #fff;
}

/* Mobile Pagination */
.mobile-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mobile-page-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.mobile-page-btn:hover:not(:disabled) {
  background: #1976d2;
  transform: scale(1.05);
}

.mobile-page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.mobile-page-info {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}
</style>
