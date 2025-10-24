<template>
  <div class="w-[80vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Laporan Jasa Bengkel</h2>

    <!-- Search Bar and Date Range -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Search Bar -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Cari Jenis Jasa</label>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari jenis jasa..."
        />
      </div>

      <!-- Start Date -->
      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
        <input
          v-model="startDate"
          type="date"
          id="startDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- End Date -->
      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
        <input
          v-model="endDate"
          type="date"
          id="endDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Jasa Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border text-left">No</th>
            <th class="px-4 py-2 border text-left">Jenis Jasa</th>
            <th class="px-4 py-2 border text-left">Pelanggan</th>
            <th class="px-4 py-2 border text-left">No. Polisi</th>
            <th class="px-4 py-2 border text-left">Harga</th>
            <th class="px-4 py-2 border text-left">Pajak (11%)</th>
            <th class="px-4 py-2 border text-left">Subtotal Harga</th>
            <th class="px-4 py-2 border text-left">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="index">
            <td class="px-4 py-2 border">{{ index + 1 }}</td>
            <td class="px-4 py-2 border">{{ item.serviceType }}</td>
            <td class="px-4 py-2 border">{{ item.customer }}</td>
            <td class="px-4 py-2 border">{{ item.licensePlate }}</td>
            <td class="px-4 py-2 border">{{ formatCurrency(item.price) }}</td>
            <td class="px-4 py-2 border">{{ formatCurrency(item.tax) }}</td>
            <td class="px-4 py-2 border">{{ formatCurrency(item.totalPrice) }}</td>
            <td class="px-4 py-2 border">{{ formatDate(item.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Print and Download PDF Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printReport"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print Report
      </button>
      <button
        @click="downloadPDF"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      servicesData: [
        {
          serviceType: 'Service',
          customer: 'Sumarjo',
          licensePlate: 'AB1509MC',
          price: 500000,
          tax: 500000 * 0.11,
          totalPrice: 500000 + 500000 * 0.11,
          date: '2025-08-05',
        },
        {
          serviceType: 'Perbaikan',
          customer: 'Budi',
          licensePlate: 'B1234CD',
          price: 1000000,
          tax: 1000000 * 0.11,
          totalPrice: 1000000 + 1000000 * 0.11,
          date: '2025-08-06',
        },
        {
          serviceType: 'Modifikasi',
          customer: 'Rudi',
          licensePlate: 'C4567EF',
          price: 1500000,
          tax: 1500000 * 0.11,
          totalPrice: 1500000 + 1500000 * 0.11,
          date: '2025-08-07',
        },
        // Add more dummy data as needed
      ],
    }
  },
  computed: {
    filteredData() {
      return this.servicesData
        .filter((item) => {
          const searchMatch = item.serviceType
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
          const dateMatch =
            (!this.startDate || new Date(item.date) >= new Date(this.startDate)) &&
            (!this.endDate || new Date(item.date) <= new Date(this.endDate))
          return searchMatch && dateMatch
        })
        .map((item) => {
          const tax = item.price * 0.11
          const totalPrice = item.price + tax
          return { ...item, tax, totalPrice }
        })
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
    printReport() {
      window.print()
    },
    downloadPDF() {
      const doc = new jsPDF()
      doc.text('Laporan Jasa Bengkel', 20, 20)
      doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 20, 30)

      // Add table headers
      doc.text('No', 20, 40)
      doc.text('Jenis Jasa', 40, 40)
      doc.text('Pelanggan', 100, 40)
      doc.text('No. Polisi', 140, 40)
      doc.text('Harga', 160, 40)
      doc.text('Pajak (11%)', 180, 40)
      doc.text('Subtotal Harga', 200, 40)
      doc.text('Tanggal', 220, 40)

      // Add data rows
      let y = 50
      this.filteredData.forEach((item, index) => {
        doc.text(`${index + 1}`, 20, y)
        doc.text(item.serviceType, 40, y)
        doc.text(item.customer, 100, y)
        doc.text(item.licensePlate, 140, y)
        doc.text(this.formatCurrency(item.price), 160, y)
        doc.text(this.formatCurrency(item.tax), 180, y)
        doc.text(this.formatCurrency(item.totalPrice), 200, y)
        doc.text(this.formatDate(item.date), 220, y)
        y += 10
      })

      doc.save('Laporan_Jasa_Bengkel.pdf')
    },
  },
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
