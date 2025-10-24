<template>
  <div class="p-6 space-y-6">
    <!-- Form Header -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Sales Order Form</h2>

    <!-- Sales Order Information -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Sales Order Details -->
      <div class="grid grid-cols-2 gap-6">
        <!-- No Sales Order -->
        <div>
          <label for="salesOrderNo" class="block text-sm font-medium text-gray-700"
            >No Sales Order</label
          >
          <input
            v-model="formData.salesOrderNo"
            id="salesOrderNo"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Nomor Work Order -->
        <div>
          <label for="workOrderNo" class="block text-sm font-medium text-gray-700"
            >Nomor Work Order</label
          >
          <input
            v-model="formData.workOrderNo"
            id="workOrderNo"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Nama Pelanggan -->
        <div>
          <label for="customerName" class="block text-sm font-medium text-gray-700"
            >Nama Pelanggan</label
          >
          <input
            v-model="formData.customerName"
            id="customerName"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Nomor Mobil -->
        <div>
          <label for="licensePlate" class="block text-sm font-medium text-gray-700"
            >Nomor Mobil</label
          >
          <input
            v-model="formData.licensePlate"
            id="licensePlate"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Brand -->
        <div>
          <label for="brand" class="block text-sm font-medium text-gray-700">Brand</label>
          <input
            v-model="formData.brand"
            id="brand"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Type -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <input
            v-model="formData.type"
            id="type"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Kapasitas CC -->
        <div>
          <label for="cc" class="block text-sm font-medium text-gray-700">Kapasitas CC</label>
          <input
            v-model="formData.cc"
            id="cc"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Tanggal -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Tanggal</label>
          <input
            v-model="formData.date"
            id="date"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>
      </div>

      <!-- Sales Order Lines -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold">Sales Order Lines</h3>
        <div
          v-for="(line, index) in formData.salesOrderLines"
          :key="index"
          class="grid grid-cols-5 gap-6 mt-4"
        >
          <!-- No -->
          <div class="flex items-center justify-center">
            <p>{{ index + 1 }}</p>
          </div>

          <!-- Nama Produk -->
          <div>
            <label for="product" class="block text-sm font-medium text-gray-700">Nama Produk</label>
            <select
              v-model="line.product"
              id="product"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Quantity -->
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              v-model="line.quantity"
              type="number"
              id="quantity"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <!-- UOM -->
          <div>
            <label for="uom" class="block text-sm font-medium text-gray-700">UOM</label>
            <input
              v-model="line.uom"
              type="text"
              id="uom"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Harga -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Harga</label>
            <input
              v-model="line.price"
              type="number"
              id="price"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Sub Total -->
          <div class="flex items-center justify-center">
            <p>{{ formatCurrency(line.quantity * line.price) }}</p>
          </div>
        </div>

        <!-- Add Line Button -->
        <button
          type="button"
          @click="addLine"
          class="mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Line
        </button>
      </div>

      <!-- Tax & Total -->
      <div class="mt-6 grid grid-cols-2 gap-6">
        <!-- Pajak (11%) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Pajak (11%)</label>
          <input
            v-model="tax"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>

        <!-- Total Harga -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Total Harga</label>
          <input
            v-model="totalPrice"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buat Sales Order
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        salesOrderNo: '',
        workOrderNo: 'WO123456', // Default work order number for example
        customerName: 'John Doe', // Sample customer name
        licensePlate: 'B 1234 XYZ', // Sample car plate
        brand: 'Toyota', // Sample car brand
        type: 'Sedan', // Sample car type
        cc: '2000', // Sample car CC
        date: new Date().toISOString().slice(0, 10), // Today's date
        salesOrderLines: [
          {
            product: '',
            quantity: 1,
            uom: 'PCS',
            price: 100000,
          },
        ],
      },
      products: [
        { id: 1, name: 'Product A' },
        { id: 2, name: 'Product B' },
        { id: 3, name: 'Product C' },
      ],
      tax: 0,
      totalPrice: 0,
    }
  },
  methods: {
    generateSalesOrderNo() {
      return Math.random().toString(36).substr(2, 10).toUpperCase() // Random alphanumeric string
    },

    addLine() {
      this.formData.salesOrderLines.push({
        product: '',
        quantity: 1,
        uom: 'PCS',
        price: 100000,
      })
    },

    calculateTax() {
      const total = this.calculateTotal()
      this.tax = total * 0.11
    },

    calculateTotal() {
      const total = this.formData.salesOrderLines.reduce(
        (acc, line) => acc + line.quantity * line.price,
        0,
      )
      this.totalPrice = total + this.tax
    },

    handleSubmit() {
      console.log('Form Submitted', this.formData)
      // Process form data (e.g., send to API or display confirmation)
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for form styling */
@media (max-width: 640px) {
  form {
    padding: 20px;
  }
}
</style>
