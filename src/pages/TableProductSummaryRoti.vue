<template>
  <div class="product-summary-container">
    <div class="header-section">
      <h2>Ringkasan Produk Kategori Roti</h2>
      <button @click="printPDF" class="print-btn">Print PDF</button>
    </div>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama atau kode produk..."
        class="search-input"
      />
    </div>
    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kode</th>
            <th>Stock</th>
            <th>Total Orders</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.nama }}</td>
            <td>{{ product.kode }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.total_orders }}</td>
            <td>{{ product.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <LoadingOverlay v-if="isLoading" />
    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
  </div>
</template>

<script>
import { BASE_URL } from '../base.utils.url.ts'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '../components/ToastCard.vue'
import api from '@/user/axios.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'TableProductSummaryRoti',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      products: [],
      searchQuery: '',
      isLoading: false,
      showToast: false,
      message_toast: '',
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products
      const q = this.searchQuery.toLowerCase()
      return this.products.filter(
        (p) =>
          (p.nama && p.nama.toLowerCase().includes(q)) ||
          (p.kode && p.kode.toLowerCase().includes(q)),
      )
    },
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}products/summary/roti`)
        if (response.data.status) {
          this.products = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data ringkasan produk roti'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching product summary roti:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data ringkasan produk roti'
        this.showToast = true
      } finally {
        this.isLoading = false
      }
    },
    async printPDF() {
      const doc = new jsPDF()

      // Create a temporary table for PDF without Kode and Category columns
      const tempTable = document.createElement('table')
      tempTable.style.width = '100%'
      tempTable.style.borderCollapse = 'collapse'
      tempTable.style.fontSize = '16px'
      tempTable.style.fontFamily = 'Arial, sans-serif'
      tempTable.innerHTML = `
        <thead>
          <tr>
            <th style="border: 2px solid #333; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; text-align: center; width: 6%;">No</th>
            <th style="border: 2px solid #333; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; text-align: left; width: 40%;">Nama Produk</th>
            <th style="border: 2px solid #333; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; text-align: center; width: 18%;">Stock</th>
            <th style="border: 2px solid #333; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; text-align: center; width: 18%;">Total Orders</th>
            <th style="border: 2px solid #333; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; text-align: center; width: 18%;">Produksi</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredProducts
            .map(
              (product, index) => `
            <tr style="background: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 500;">${index + 1}</td>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 500;">${product.nama}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 500;">${product.stock}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 500;">${product.total_orders}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 500;"></td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      `

      document.body.appendChild(tempTable)

      try {
        const canvas = await html2canvas(tempTable, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        })

        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 295 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        // Add title with better styling
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text('Ringkasan Produk Kategori Roti', 105, 20, { align: 'center' })

        // Add date and time
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        const currentDateTime = new Date().toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        doc.text(`Dicetak pada: ${currentDateTime}`, 105, 30, { align: 'center' })

        position = 40

        doc.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight)
          heightLeft -= pageHeight
        }

        doc.save('ringkasan-produk-roti.pdf')
      } catch (error) {
        console.error('Error generating PDF:', error)
        this.message_toast = 'Gagal membuat PDF'
        this.showToast = true
      } finally {
        document.body.removeChild(tempTable)
      }
    },
  },
}
</script>

<style scoped>
.product-summary-container {
  max-width: 1200px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-x: auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.product-summary-container h2 {
  margin: 0;
  color: #333;
  font-size: 2em;
  font-weight: 700;
}

.print-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.print-btn:hover {
  background: #0056b3;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  width: 300px;
  max-width: 100%;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 1em;
}

.product-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ddd;
}

.product-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #e8f4fd;
}

.product-table td {
  color: #333;
}

@media (max-width: 768px) {
  .product-summary-container {
    padding: 16px;
  }

  .search-bar {
    flex-direction: column;
    align-items: center;
  }

  .search-input {
    width: 100%;
  }

  .product-table th,
  .product-table td {
    padding: 10px 12px;
    font-size: 0.9em;
  }
}
</style>
