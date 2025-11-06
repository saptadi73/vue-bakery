<template>
  <div class="product-summary-container">
    <div class="header-section">
      <div>
        <h2 class="title">📦 Ringkasan Produk</h2>
        <p class="subtitle">Menampilkan daftar produk berdasarkan kategori dan hasil pencarian</p>
      </div>
      <button @click="printPDF" class="print-btn"><i class="fa fa-file-pdf"></i> Cetak PDF</button>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <label for="category">Kategori:</label>
        <select v-model="selectedCategory" id="category" class="filter-select">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="filter-group search-group">
        <label for="search">Pencarian:</label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau kode produk..."
          class="search-input"
        />
      </div>
    </div>

    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Kode</th>
            <th>Stok</th>
            <th>Total Order</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.nama }}</td>
            <td>{{ product.kode }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.total_orders }}</td>
            <td>
              <span class="category-badge">{{ product.category }}</span>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="empty-state">Tidak ada data ditemukan.</td>
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

export default {
  name: 'TableProductSummaryRoti',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      searchQuery: '',
      isLoading: false,
      showToast: false,
      message_toast: '',
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products
      if (this.selectedCategory)
        filtered = filtered.filter((p) => p.category === this.selectedCategory)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            (p.nama && p.nama.toLowerCase().includes(q)) ||
            (p.kode && p.kode.toLowerCase().includes(q)),
        )
      }
      return filtered
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
          this.categories = [...new Set(response.data.data.map((p) => p.category).filter(Boolean))]
        } else {
          this.message_toast = 'Gagal mengambil data produk'
          this.showToast = true
        }
      } catch (error) {
        console.error('Error fetching product summary roti:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data'
        this.showToast = true
      } finally {
        this.isLoading = false
      }
    },

    printPDF() {
      const doc = new jsPDF('p', 'mm', 'a4') // portrait
      const pageWidth = doc.internal.pageSize.getWidth() // 210 mm
      const pageHeight = doc.internal.pageSize.getHeight() // 297 mm
      const marginLeft = 10
      let marginTop = 15 // Mengubah 'const' menjadi 'let' agar nilai marginTop dapat diubah
      const rowHeight = 10

      const title =
        this.selectedCategory !== ''
          ? `Ringkasan Produk - ${this.selectedCategory}`
          : 'Ringkasan Semua Produk'

      const dateText = new Date().toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      })

      marginTop += 2

      doc.setFontSize(13)
      doc.text(title, pageWidth / 2, marginTop, { align: 'center' })
      marginTop += 5
      doc.setFontSize(10)
      doc.text(`Dicetak pada: ${dateText}`, pageWidth / 2, marginTop, { align: 'center' })
      marginTop += 15

      // === MENULIS HEADER MANUAL DENGAN BORDER DAN ARSIRAN ===
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')

      const header = ['No', 'Nama', 'Stok', 'Order', 'Kategori', 'Produksi']
      const colWidths = [10, 70, 20, 25, 40, 25] // total = 190 mm

      let x = marginLeft
      let y = marginTop

      // Gambar kotak untuk header dengan arsiran
      header.forEach((text, index) => {
        // Gambar border kotak
        doc.setDrawColor(150) // Garis tepi kotak dengan warna abu-abu
        doc.rect(x, y, colWidths[index], rowHeight) // Gambar kotak border

        // Isi kotak dengan arsiran abu-abu tipis
        doc.setFillColor(211, 211, 211) // Warna abu-abu terang (Light Gray)
        doc.rect(x, y, colWidths[index], rowHeight, 'F') // Gambar kotak dengan arsiran

        // Tulis teks header di dalam kotak
        doc.setTextColor(0, 0, 0) // Set warna teks hitam
        const textX = x + colWidths[index] / 2
        const textY = y + rowHeight / 2 + 3
        doc.text(text, textX, textY, { align: 'center' })
        x += colWidths[index]
      })

      marginTop += rowHeight // Update marginTop setelah menulis header

      // === STRUKTUR KOLOM (total lebar ±190mm agar muat di portrait) ===
      const drawFooter = (pageNum, totalPages) => {
        doc.setFontSize(9)
        doc.setTextColor(120)
        doc.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth - 35, pageHeight - 8)
      }

      const drawRow = (product, index) => {
        let x = marginLeft
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        // Pastikan teks di dalam tabel tidak hilang dan dapat terbaca
        doc.setTextColor(0, 0, 0) // Set warna teks hitam untuk konten tabel

        const values = [
          index + 1,
          product.nama,
          product.stock,
          product.total_orders,
          product.category,
          '', // kolom Produksi manual
        ]

        values.forEach((val, i) => {
          const w = colWidths[i]
          doc.setDrawColor(200) // Garis tepi kotak dengan warna abu-abu
          doc.rect(x, marginTop, w, rowHeight) // Gambar kotak untuk setiap kolom
          const textX = x + w / 2
          const textY = marginTop + rowHeight / 2 + 3
          doc.text(String(val), textX, textY, { align: 'center' })
          x += w
        })
        marginTop += rowHeight
      }

      // === CETAK DATA ===
      for (let i = 0; i < this.filteredProducts.length; i++) {
        drawRow(this.filteredProducts[i], i)

        // Tambahkan halaman baru jika mencapai batas bawah halaman
        if (marginTop + rowHeight > pageHeight - 20) {
          doc.addPage()
          marginTop = 35
        }
      }

      // === FOOTER ===
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        drawFooter(i, totalPages)
      }

      const fileName =
        this.selectedCategory !== ''
          ? `Ringkasan_${this.selectedCategory}.pdf`
          : 'Ringkasan_Semua_Produk.pdf'
      doc.save(fileName)
    },
  },
}
</script>

<style scoped>
.product-summary-container {
  max-width: 1200px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  padding: 32px;
  font-family: 'Poppins', sans-serif;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.title {
  font-size: 1.8em;
  font-weight: 700;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  font-size: 0.95em;
  color: #6b7280;
  margin-top: 4px;
}
.print-btn {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 0.95em;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.2s ease;
}
.print-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(79, 70, 229, 0.6);
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px 20px;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-size: 0.9em;
}
.filter-select,
.search-input {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95em;
  transition: border 0.2s;
}
.filter-select:focus,
.search-input:focus {
  border-color: #6366f1;
  outline: none;
}
.search-group {
  flex: 1;
}
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 1.1em;
}
.product-table th {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: #fff;
  padding: 16px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.product-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #374151;
}
.product-table tr:nth-child(even) {
  background-color: #f9fafb;
}
.product-table tr:hover {
  background-color: #eef2ff;
  transition: background 0.2s ease-in-out;
}
.category-badge {
  background: #e0e7ff;
  color: #3730a3;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.9em;
}
.empty-state {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}
</style>
