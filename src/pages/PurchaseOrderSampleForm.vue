<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="border border-gray-300 shadow-md p-6 rounded-md">
      <h1 class="text-3xl font-bold text-blue-600 mb-6 text-center">PURCHASE ORDER</h1>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Left Column -->
        <div>
          <h3 class="font-semibold text-lg">Your Company</h3>
          <p>Your Company Name</p>
          <p>89 Your Company Street, City, State, Country</p>
          <p>123-456-7890</p>
          <p>your@companyemail.com</p>
          <p>yourwebsite.com</p>
        </div>

        <!-- Right Column -->
        <div>
          <h3 class="font-semibold text-lg">Request No: 000001</h3>
          <p>Ship Via: USPS</p>
          <p>FOB: 000001</p>
          <p>Shipping Terms: [Insert]</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Vendor Info -->
        <div>
          <h3 class="font-semibold text-lg">Vendor</h3>
          <p>Your Vendor Name</p>
          <p>34 Your Client Street, City, State, Country</p>
          <p>234-567-5678</p>
          <p>your@clientemail.com</p>
        </div>

        <!-- Ship To Info -->
        <div>
          <h3 class="font-semibold text-lg">Ship To</h3>
          <p>Name</p>
          <p>34 Your Client Street, City, State, Country</p>
          <p>234-567-5678</p>
          <p>your@clientemail.com</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <!-- Purchase Order Table -->
        <table class="min-w-full table-auto text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2">Item Details</th>
              <th class="px-4 py-2">Qty</th>
              <th class="px-4 py-2">Unit Price</th>
              <th class="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="border-b">
              <td class="px-4 py-2">{{ item.details }}</td>
              <td class="px-4 py-2">{{ item.qty }}</td>
              <td class="px-4 py-2">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="px-4 py-2">{{ formatCurrency(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Subtotal, Tax, and Shipping -->
      <div class="mt-6 flex justify-between text-lg font-semibold">
        <div>
          <p>Sub Total: {{ formatCurrency(subTotal) }}</p>
          <p>Tax/VAT (10%): {{ formatCurrency(tax) }}</p>
          <p>Shipping Fee: {{ formatCurrency(shippingFee) }}</p>
        </div>
        <div class="text-right">
          <p>Total: {{ formatCurrency(total) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { details: 'Your Product Name - Product Description', qty: 2, unitPrice: 200, total: 400 },
        { details: 'Your Product Name - Product Description', qty: 3, unitPrice: 100, total: 300 },
        { details: 'Your Product Name - Product Description', qty: 3, unitPrice: 200, total: 600 },
        { details: 'Your Product Name - Product Description', qty: 3, unitPrice: 100, total: 300 },
        { details: 'Your Product Name - Product Description', qty: 2, unitPrice: 200, total: 400 },
      ],
      subTotal: 2000,
      tax: 200,
      shippingFee: 20,
    }
  },
  computed: {
    total() {
      return this.subTotal + this.tax + this.shippingFee
    },
  },
  methods: {
    formatCurrency(value) {
      return `$ ${value.toFixed(2)}`
    },
  },
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
