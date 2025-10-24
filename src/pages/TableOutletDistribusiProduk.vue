<template>
  <div class="outlet-distribusi-table-container">
    <h2>Distribusi Produk ke Outlet</h2>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari outlet..." class="search-input" />
    </div>
    <table class="outlet-distribusi-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>Gambar</th>
          <th>Nama Outlet</th>
          <th>ID Outlet</th>
          <th>Kode Outlet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.outlet_id">
          <td>
            <img
              :src="
                item.gambar
                  ? `${BASE_URL}${item.gambar}`
                  : `${BASE_URL}uploads/outlets/outlet_default.jpg`
              "
              alt="Gambar Outlet"
              class="outlet-img"
              loading="lazy"
            />
          </td>
          <td>
            <router-link
              :to="`/delivery/outlet/${item.outlet_id}/${item.kode}/${encodeURIComponent(item.outlet_name)}`"
              class="outlet-link"
            >
              {{ item.outlet_name }}
            </router-link>
          </td>
          <td>{{ item.outlet_id }}</td>
          <td>{{ item.kode }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="outlet-distribusi-card-list" v-else>
      <div class="outlet-distribusi-card" v-for="item in paginatedData" :key="item.outlet_id">
        <div class="outlet-img-row">
          <img
            :src="
              item.gambar
                ? `${BASE_URL}${item.gambar}`
                : `${BASE_URL}uploads/outlets/outlet_default.jpg`
            "
            alt="Gambar Outlet"
            class="outlet-img"
            loading="lazy"
          />
        </div>
        <div class="outlet-row">
          <span class="outlet-label">Nama Outlet:</span>
          <router-link
            :to="`/delivery/outlet/${item.outlet_id}/${item.kode}/${encodeURIComponent(item.outlet_name)}`"
            class="outlet-link"
          >
            {{ item.outlet_name }}
          </router-link>
        </div>
        <div class="outlet-row">
          <span class="outlet-label">ID Outlet:</span> {{ item.outlet_id }}
        </div>
        <div class="outlet-row"><span class="outlet-label">Kode Outlet:</span> {{ item.kode }}</div>
      </div>
    </div>
    <div class="pagination-bar">
      <button :disabled="currentPage === 1" @click="currentPage--">&laquo;</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">&raquo;</button>
    </div>
  </div>
  <loading-overlay />
</template>

<script>
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'
import { useRoute } from 'vue-router'

export default {
  name: 'TableOutletDistribusiProduk',
  components: {
    LoadingOverlay,
  },
  data() {
    return {
      BASE_URL,
      useLoadingStore: useLoadingStore(),
      route: useRoute(),
      data: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 6,
      isMobile: false,
    }
  },
  computed: {
    filteredData() {
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return this.data
      // Debug log untuk melihat isi data dan field
      if (this.data && this.data.length > 0) {
        console.log('Contoh data:', this.data[0])
      } else {
        console.log('Data kosong')
      }
      return this.data.filter(
        (item) =>
          (item.outlet_name && item.outlet_name.toLowerCase().includes(q)) ||
          (item.outlet_id && String(item.outlet_id).toLowerCase().includes(q)) ||
          (item.kode && String(item.kode).toLowerCase().includes(q)),
      )
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize))
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    },
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 600
    },
    async fetchData() {
      // Ganti endpoint sesuai kebutuhan
      try {
        this.useLoadingStore.show()
        const response = await axios.get(`${this.BASE_URL}orders/groups`)
        this.data = response.data.data
        console.log('Fetched data:', this.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.useLoadingStore.hide()
      }
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    filteredData(newValue) {
      console.log('Filtered data updated:', newValue)
    },
  },
}
</script>

<style scoped>
.outlet-distribusi-table-container {
  max-width: 1100px;
  margin: 32px auto;
  background: linear-gradient(120deg, #f8fafc 60%, #e3f0fc 100%);
  border-radius: 18px;
  box-shadow:
    0 4px 24px rgba(25, 118, 210, 0.1),
    0 1.5px 8px rgba(0, 0, 0, 0.06);
  padding: 36px 38px 28px 38px;
  border: 1.5px solid #e3eaf5;
}
.outlet-distribusi-table {
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.06);
}
.outlet-distribusi-table th {
  padding: 16px 12px;
  background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%);
  color: #fff;
  font-size: 1.08em;
  font-weight: 700;
  border-bottom: 2.5px solid #e3eaf5;
  text-align: center;
  letter-spacing: 0.5px;
}
.outlet-distribusi-table td {
  padding: 14px 12px;
  border-bottom: 1.5px solid #e3eaf5;
  text-align: center;
  background: #fafdff;
  font-size: 1.04em;
}
.outlet-distribusi-table tr:last-child td {
  border-bottom: none;
}
.outlet-img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #f5f5f5;
  margin-right: 4px;
}
.outlet-img-row {
  justify-content: center;
  margin-bottom: 10px;
}
.outlet-distribusi-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.outlet-distribusi-card {
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 16px 18px;
  margin-bottom: 4px;
  font-size: 1.04em;
}
.outlet-row {
  margin-bottom: 7px;
  display: flex;
  gap: 8px;
}
.outlet-label {
  font-weight: 600;
  color: #666;
  min-width: 110px;
  display: inline-block;
}
@media (max-width: 600px) {
  .outlet-distribusi-table {
    display: none;
  }
  .outlet-distribusi-card-list {
    display: flex;
  }
}
@media (min-width: 601px) {
  .outlet-distribusi-card-list {
    display: none;
  }
}
.search-bar {
  margin-bottom: 16px;
  text-align: right;
}
.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 220px;
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
}
.pagination-bar button {
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 5px;
  padding: 4px 12px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.18s;
}
.pagination-bar button:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
.outlet-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 700;
  transition: color 0.18s;
}
.outlet-link:hover {
  color: #1565c0;
}
</style>
