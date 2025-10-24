<template>
  <div class="delivery-report-card">
    <h2 class="outlet-title">{{ outletName }}</h2>
    <div class="outlet-subtitle">
      Kode Outlet: <b>{{ outletCode }}</b>
    </div>
    <table class="product-table">
      <thead>
        <tr>
          <th>Nama Produk</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in data" :key="value.id">
          <td>{{ value.product_name }}</td>
          <td>{{ value.total_quantity }}</td>
        </tr>
      </tbody>
    </table>
    <div class="delivery-info">
      <div><b>Pengirim:</b> Siti Aminah</div>
      <div><b>Penerima:</b> Budi Santoso</div>
      <div><b>Tanggal Diterima:</b> 2025-09-08</div>
    </div>
    <button class="btn-confirm-recipient">Konfirmasi Penerimaan</button>
  </div>
  <loading-overlay />
</template>

<script>
import { useRoute } from 'vue-router'
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from '@/base.utils.url'

export default {
  name: 'CardReportDeliveryProdukStatic',
  components: { LoadingOverlay },
  data() {
    const route = useRoute()
    return {
      data: [],
      BASE_URL,
      useLoadingStore: useLoadingStore(),
      route: useRoute(),
      outletId: route.params.id || 'OUT-001',
      outletName: route.params.name || 'Outlet Jaya Makmur',
      outletCode: route.params.kode || 'KJ-01',
    }
  },
  created() {
    this.fetchDeliveryData()
  },
  methods: {
    async fetchDeliveryData() {
      try {
        this.useLoadingStore.show()
        const response = await axios.get(`${this.BASE_URL}orders/outlets/${this.outletId}`)
        this.data = response.data.data
        // Proses data response sesuai kebutuhan
        console.log('Delivery Data:', this.data)
      } catch (error) {
        console.error('Error fetching delivery data:', error)
      } finally {
        this.useLoadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
.delivery-report-card {
  max-width: 480px;
  margin: 32px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 4px 18px rgba(25, 118, 210, 0.1),
    0 1.5px 8px rgba(0, 0, 0, 0.06);
  padding: 28px 28px 18px 28px;
  border: 1.5px solid #e3eaf5;
  font-size: 1.08em;
}
.outlet-title {
  margin-bottom: 2px;
  font-size: 1.35em;
  color: #1976d2;
  font-weight: 700;
  text-align: center;
}
.outlet-subtitle {
  color: #666;
  font-size: 1.08em;
  margin-bottom: 18px;
  text-align: center;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 18px;
}
.product-table th {
  background: #e3f0fc;
  color: #1976d2;
  font-weight: 700;
  padding: 10px 8px;
  border-bottom: 2px solid #e3eaf5;
}
.product-table td {
  padding: 9px 8px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}
.product-table tr:last-child td {
  border-bottom: none;
}
.delivery-info {
  margin-top: 18px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 16px;
  color: #444;
  font-size: 1.04em;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.btn-confirm-recipient {
  display: block;
  margin: 24px auto 0 auto;
  padding: 11px 32px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #1b3a2b;
  font-weight: 700;
  font-size: 1.08em;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(67, 233, 123, 0.1);
  cursor: pointer;
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.12s;
}
.btn-confirm-recipient:hover,
.btn-confirm-recipient:focus {
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
  box-shadow: 0 4px 18px rgba(67, 233, 123, 0.18);
  transform: translateY(-2px) scale(1.04);
}
</style>
