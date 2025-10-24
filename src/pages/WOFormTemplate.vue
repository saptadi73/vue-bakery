<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Work Order Form</h2>

    <!-- Customer Information Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="customerName" class="block text-sm font-medium text-gray-700"
          >Customer Name</label
        >
        <input
          v-model="form.customerName"
          type="text"
          id="customerName"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter customer name"
        />
      </div>
      <div>
        <label for="vehicle" class="block text-sm font-medium text-gray-700">Vehicle</label>
        <input
          v-model="form.vehicle"
          type="text"
          id="vehicle"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter vehicle model"
        />
      </div>
    </div>

    <!-- Work Order Details Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Work Order Details</h3>
      <div class="space-y-4">
        <div v-for="(item, index) in form.items" :key="index" class="flex items-center space-x-4">
          <input
            v-model="item.code"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kode"
          />
          <input
            v-model="item.name"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Item"
          />
          <input
            v-model="item.qty"
            type="number"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Qty"
          />
          <input
            v-model="item.price"
            type="number"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Harga"
          />
        </div>
      </div>
      <button
        @click="addItem"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Item
      </button>
    </div>

    <!-- Subtotal, Total, and Payment Method -->
    <div class="space-y-6 mb-6">
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Subtotal Jasa</span>
        <span>{{ formatCurrency(form.subtotalJasa) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Total Tagihan</span>
        <span>{{ formatCurrency(form.totalTagihan) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">DP</span>
        <span>{{ formatCurrency(form.dp) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Sisa</span>
        <span>{{ formatCurrency(form.sisa) }}</span>
      </div>

      <div class="mt-6">
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700"
          >Payment Method</label
        >
        <input
          v-model="form.paymentMethod"
          type="text"
          id="paymentMethod"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter payment method"
        />
      </div>
    </div>

    <!-- Service Date and KM -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="serviceDate" class="block text-sm font-medium text-gray-700"
          >Service Date</label
        >
        <input
          v-model="form.serviceDate"
          type="date"
          id="serviceDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="vehicleKm" class="block text-sm font-medium text-gray-700">Vehicle KM</label>
        <input
          v-model="form.vehicleKm"
          type="number"
          id="vehicleKm"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter vehicle km"
        />
      </div>
    </div>

    <div class="text-center">
      <button
        @click="submitForm"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Submit Work Order
      </button>
    </div>

    <!-- Print and Download Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printForm"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print
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
      form: {
        customerName: '',
        vehicle: '',
        serviceDate: '',
        vehicleKm: '',
        paymentMethod: '',
        dp: 0,
        subtotalJasa: 0,
        totalTagihan: 0,
        sisa: 0,
        items: [{ code: '', name: '', qty: 0, price: 0 }],
      },
    }
  },
  computed: {
    totalJasa() {
      return this.form.items.reduce((acc, item) => acc + item.qty * item.price, 0)
    },
    totalTagihan() {
      return this.totalJasa + this.form.subtotalJasa
    },
  },
  methods: {
    addItem() {
      this.form.items.push({ code: '', name: '', qty: 0, price: 0 })
    },
    submitForm() {
      console.log(this.form)
      // Handle form submission logic
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    printForm() {
      window.print() // Print the page
    },
    downloadPDF() {
      const doc = new jsPDF()
      doc.text('Work Order Form', 20, 20)
      doc.text(`Customer Name: ${this.form.customerName}`, 20, 30)
      doc.text(`Vehicle: ${this.form.vehicle}`, 20, 40)
      doc.text(`Service Date: ${this.form.serviceDate}`, 20, 50)
      doc.text(`Vehicle KM: ${this.form.vehicleKm}`, 20, 60)
      doc.text(`Payment Method: ${this.form.paymentMethod}`, 20, 70)
      doc.text(`Subtotal Jasa: ${this.formatCurrency(this.form.subtotalJasa)}`, 20, 80)
      doc.text(`Total Tagihan: ${this.formatCurrency(this.form.totalTagihan)}`, 20, 90)
      doc.text(`DP: ${this.formatCurrency(this.form.dp)}`, 20, 100)
      doc.text(`Sisa: ${this.formatCurrency(this.form.sisa)}`, 20, 110)

      // Add item details to PDF
      this.form.items.forEach((item, index) => {
        doc.text(
          `${item.code} - ${item.name} - ${item.qty} - ${this.formatCurrency(item.price)}`,
          20,
          120 + index * 10,
        )
      })

      doc.save('WorkOrderForm.pdf')
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
