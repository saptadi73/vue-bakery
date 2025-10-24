<template>
  <div class="p-6 space-y-6">
    <!-- Form Header -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Work Order Form</h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Customer Selection -->
      <div>
        <label for="customer" class="block text-sm font-medium text-gray-700">Nama Pelanggan</label>
        <select
          v-model="formData.customer"
          id="customer"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </div>

      <!-- Car Selection based on Customer -->
      <div>
        <label for="car" class="block text-sm font-medium text-gray-700">Nomor Polisi</label>
        <select
          v-model="formData.car"
          id="car"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option v-for="car in filteredCars" :key="car.id" :value="car.id">
            {{ car.licensePlate }}
          </option>
        </select>
      </div>

      <!-- Auto Date and Time -->
      <div>
        <label for="registerDate" class="block text-sm font-medium text-gray-700"
          >Tanggal Jam Terdaftar</label
        >
        <input
          v-model="formData.registerDate"
          id="registerDate"
          type="datetime-local"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :min="currentDateTime"
          readonly
        />
      </div>

      <!-- Service Type -->
      <div>
        <label for="serviceType" class="block text-sm font-medium text-gray-700"
          >Jenis Penanganan</label
        >
        <select
          v-model="formData.serviceType"
          id="serviceType"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Perbaikan">Perbaikan</option>
          <option value="Modifikasi">Modifikasi</option>
          <option value="Service Rutin">Service Rutin</option>
        </select>
      </div>

      <!-- Complaint -->
      <div>
        <label for="complaint" class="block text-sm font-medium text-gray-700">Keluhan</label>
        <textarea
          v-model="formData.complaint"
          id="complaint"
          rows="4"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan keluhan"
          required
        ></textarea>
      </div>

      <!-- Staff Member Handling -->
      <div>
        <label for="handledBy" class="block text-sm font-medium text-gray-700"
          >Ditangani Oleh Pegawai</label
        >
        <select
          v-model="formData.handledBy"
          id="handledBy"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option v-for="employee in employees" :key="employee.id" :value="employee.id">
            {{ employee.name }}
          </option>
        </select>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buat Work Order
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
        customer: '',
        car: '',
        registerDate: '',
        serviceType: 'Perbaikan',
        complaint: '',
      },
      customers: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Maria Sari' },
        { id: 3, name: 'Ali Rahman' },
      ],
      cars: [
        { id: 1, customerId: 1, licensePlate: 'B 1234 XYZ' },
        { id: 2, customerId: 1, licensePlate: 'B 5678 ABC' },
        { id: 3, customerId: 2, licensePlate: 'B 9101 GHI' },
        { id: 4, customerId: 3, licensePlate: 'L 2345 DEF' },
        { id: 5, customerId: 3, licensePlate: 'L 6789 GHI' },
      ],
      employees: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
      currentDateTime: new Date().toISOString().slice(0, 16), // Get current date and time in "YYYY-MM-DDTHH:MM" format
    }
  },
  computed: {
    filteredCars() {
      return this.cars.filter((car) => car.customerId === this.formData.customer)
    },
  },
  methods: {
    handleSubmit() {
      console.log('Form Submitted', this.formData)
      // Process form data (e.g., send to API or display confirmation)
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
