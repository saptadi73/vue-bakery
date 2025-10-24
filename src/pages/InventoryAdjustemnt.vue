<template>
  <div class="p-6 space-y-6">
    <!-- Form Header -->
    <div class="flex justify-center items-center mb-8">
      <h1 class="text-4xl font-semibold text-gray-800 font-montserrat">
        Inventory Adjustment Form
      </h1>
    </div>

    <!-- Inventory Adjustment Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <!-- Product Name Input -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="productName" class="block text-sm font-medium text-gray-700 mb-2"
            >Nama Produk</label
          >
          <input
            v-model="formData.productName"
            id="productName"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Nama Produk"
            required
          />
        </div>

        <!-- Quantity Terhitung Manual -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="manualQuantity" class="block text-sm font-medium text-gray-700 mb-2"
            >Quantity Terhitung Manual</label
          >
          <input
            v-model="formData.manualQuantity"
            id="manualQuantity"
            type="number"
            min="0"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Quantity Manual"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <!-- Quantity Tercatat di Sistem -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="systemQuantity" class="block text-sm font-medium text-gray-700 mb-2"
            >Quantity Tercatat di Sistem</label
          >
          <input
            v-model="formData.systemQuantity"
            id="systemQuantity"
            type="number"
            min="0"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Quantity Tercatat"
            required
          />
        </div>

        <!-- UoM (Unit, Liter, M) -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="uom" class="block text-sm font-medium text-gray-700 mb-2"
            >UoM (Unit, Liter, M)</label
          >
          <select
            v-model="formData.uom"
            id="uom"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled>Pilih UoM</option>
            <option value="Unit">Unit</option>
            <option value="Liter">Liter</option>
            <option value="M">Meter</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <!-- Penanggung Jawab -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="responsiblePerson" class="block text-sm font-medium text-gray-700 mb-2"
            >Penanggung Jawab</label
          >
          <input
            v-model="formData.responsiblePerson"
            id="responsiblePerson"
            type="text"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Masukkan Nama Penanggung Jawab"
            required
          />
        </div>

        <!-- Tanggal Adjustment -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <label for="adjustmentDate" class="block text-sm font-medium text-gray-700 mb-2"
            >Tanggal Adjustment</label
          >
          <input
            v-model="formData.adjustmentDate"
            id="adjustmentDate"
            type="date"
            class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <!-- Stock Akhir -->
        <label for="finalStock" class="block text-sm font-medium text-gray-700 mb-2"
          >Stock Akhir</label
        >
        <input
          v-model="formData.finalStock"
          id="finalStock"
          type="number"
          min="0"
          class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Masukkan Stock Akhir"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Submit
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
        productName: '',
        manualQuantity: '',
        systemQuantity: '',
        uom: '',
        responsiblePerson: '',
        adjustmentDate: '',
        finalStock: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      console.log('Inventory Adjustment Submitted', this.formData)
      // Process form data (e.g., send to API or display confirmation)
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for responsive layout */
@media (max-width: 768px) {
  .form-section {
    padding: 12px;
  }

  .grid {
    grid-template-columns: 1fr; /* Stack form fields vertically on smaller screens */
  }
}
</style>
