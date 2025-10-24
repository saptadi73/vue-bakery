<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Form Purchasing Order</h2>

    <!-- Form Purchasing Order -->
    <div class="bg-white p-6 border border-gray-300 rounded-lg shadow-md">
      <form @submit.prevent="submitPurchaseOrder">
        <!-- Supplier Information -->
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Informasi Supplier</h3>

        <div class="mb-4">
          <label for="supplierName" class="block text-sm text-gray-700">Nama Supplier</label>
          <input
            id="supplierName"
            v-model="purchaseOrder.supplierName"
            type="text"
            required
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <!-- Order Lines -->
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Line</h3>

        <div
          v-for="(line, index) in purchaseOrder.orderLines"
          :key="index"
          class="mb-4 border-b pb-4"
        >
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="productName" class="block text-sm text-gray-700">Nama Produk</label>
              <input
                v-model="line.productName"
                type="text"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label for="quantity" class="block text-sm text-gray-700">Quantity</label>
              <input
                v-model="line.quantity"
                type="number"
                required
                min="1"
                @input="updateLine(index)"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label for="uom" class="block text-sm text-gray-700">UOM</label>
              <input
                v-model="line.uom"
                type="text"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label for="unitPrice" class="block text-sm text-gray-700">Harga Satuan</label>
              <input
                v-model="line.unitPrice"
                type="number"
                required
                min="0"
                @input="updateLine(index)"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label for="tax" class="block text-sm text-gray-700">Tax (11%)</label>
              <input
                v-model="line.tax"
                type="number"
                readonly
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label for="subTotal" class="block text-sm text-gray-700">Sub Total</label>
              <input
                v-model="line.subTotal"
                type="number"
                readonly
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div class="mt-2">
            <button
              @click="removeOrderLine(index)"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Hapus Baris
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            @click="addOrderLine"
            class="py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Tambah Baris
          </button>
        </div>

        <!-- Total & Tax -->
        <div class="mt-4 flex justify-between">
          <div class="text-lg font-semibold text-gray-700">Total:</div>
          <div class="text-lg font-semibold text-gray-700">{{ formatCurrency(totalAmount) }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-lg font-semibold text-gray-700">Total Pajak (11%):</div>
          <div class="text-lg font-semibold text-gray-700">{{ formatCurrency(totalTax) }}</div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            class="py-2 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simpan Pesanan
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div v-if="isOrderSubmitted" class="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
      <p>Pesanan barang berhasil disimpan!</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      purchaseOrder: {
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: '',
        supplierDeliveryDate: '',
        paymentDate: '',
        orderLines: [
          {
            productName: '',
            quantity: 1,
            uom: '',
            unitPrice: 0,
            tax: 0,
            subTotal: 0,
          },
        ],
      },
      isOrderSubmitted: false,
    }
  },
  computed: {
    totalAmount() {
      return this.purchaseOrder.orderLines.reduce((total, line) => total + line.subTotal, 0)
    },
    totalTax() {
      return this.purchaseOrder.orderLines.reduce((total, line) => total + line.tax, 0)
    },
  },
  methods: {
    addOrderLine() {
      this.purchaseOrder.orderLines.push({
        productName: '',
        quantity: 1,
        uom: '',
        unitPrice: 0,
        tax: 0,
        subTotal: 0,
      })
    },
    removeOrderLine(index) {
      this.purchaseOrder.orderLines.splice(index, 1)
    },
    calculateTax(unitPrice, quantity) {
      return unitPrice * quantity * 0.11
    },
    calculateSubTotal(unitPrice, quantity) {
      return unitPrice * quantity + this.calculateTax(unitPrice, quantity)
    },
    updateLine(index) {
      const line = this.purchaseOrder.orderLines[index]
      line.tax = this.calculateTax(line.unitPrice, line.quantity)
      line.subTotal = this.calculateSubTotal(line.unitPrice, line.quantity)
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    submitPurchaseOrder() {
      console.log('Purchase Order:', this.purchaseOrder)
      this.isOrderSubmitted = true

      setTimeout(() => {
        this.isOrderSubmitted = false
      }, 3000)

      // Reset form after submission
      this.purchaseOrder = {
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: '',
        supplierDeliveryDate: '',
        paymentDate: '',
        orderLines: [
          {
            productName: '',
            quantity: 1,
            uom: '',
            unitPrice: 0,
            tax: 0,
            subTotal: 0,
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
/* Optional: Custom styles to improve form appearance */
form {
  max-width: 800px;
  margin: auto;
}

textarea {
  resize: vertical;
}

button {
  transition: background-color 0.3s ease;
}
</style>
