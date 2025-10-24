<template>
  <div class="p-8 space-y-8">
    <!-- Form Header -->
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Vehicle Registration Form
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Owner Name Input -->
          <div>
            <label for="ownerName" class="block text-sm font-medium text-gray-700 mb-2"
              >Owner's Name</label
            >
            <select
              v-model="formData.ownerName"
              id="ownerName"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Owner</option>
              <option v-for="(customer, index) in customers" :key="index" :value="customer.name">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <!-- Car Type Input -->
          <div class="mt-6">
            <label for="carType" class="block text-sm font-medium text-gray-700 mb-2"
              >Car Type</label
            >
            <select
              v-model="formData.carType"
              id="carType"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Car Type</option>
              <option value="SUV">SUV</option>
              <option value="MPV">MPV</option>
              <option value="Sedan">Sedan</option>
              <option value="Minibus">Minibus</option>
            </select>
          </div>

          <!-- Brand Input -->
          <div class="mt-6">
            <label for="brand" class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              v-model="formData.brand"
              id="brand"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Brand</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Suzuki">Suzuki</option>
              <option value="Nissan">Nissan</option>
              <option value="BMW">BMW</option>
              <option value="Audi">Audi</option>
              <option value="Kia">Kia</option>
              <option value="Hyundai">Hyundai</option>
              <option value="BYD">BYD</option>
              <option value="Wuling">Wuling</option>
              <option value="Cherry">Cherry</option>
            </select>
          </div>

          <!-- Model Input -->
          <div class="mt-6">
            <label for="model" class="block text-sm font-medium text-gray-700 mb-2"
              >Car Model</label
            >
            <input
              v-model="formData.model"
              id="model"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Car Model"
              required
            />
          </div>

          <!-- Year Input -->
          <div class="mt-6">
            <label for="year" class="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              v-model="formData.year"
              id="year"
              type="number"
              min="1900"
              max="2099"
              step="1"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Car Year"
              required
            />
          </div>

          <!-- Chassis Number Input -->
          <div class="mt-6">
            <label for="chassisNumber" class="block text-sm font-medium text-gray-700 mb-2"
              >Chassis Number</label
            >
            <input
              v-model="formData.chassisNumber"
              id="chassisNumber"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Chassis Number"
              required
            />
          </div>

          <!-- Engine Number Input -->
          <div class="mt-6">
            <label for="engineNumber" class="block text-sm font-medium text-gray-700 mb-2"
              >Engine Number</label
            >
            <input
              v-model="formData.engineNumber"
              id="engineNumber"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Engine Number"
              required
            />
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Engine Type Input -->
          <div class="mt-6">
            <label for="engineType" class="block text-sm font-medium text-gray-700 mb-2"
              >Engine Type</label
            >
            <select
              v-model="formData.engineType"
              id="engineType"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Engine Type</option>
              <option value="Bensin">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <!-- Engine Capacity Input -->
          <div class="mt-6">
            <label for="cc" class="block text-sm font-medium text-gray-700 mb-2"
              >Engine Capacity (CC)</label
            >
            <input
              v-model="formData.cc"
              id="cc"
              type="number"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Engine Capacity"
              required
            />
          </div>

          <!-- License Plate Input -->
          <div class="mt-6">
            <label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-2"
              >License Plate</label
            >
            <input
              v-model="formData.licensePlate"
              id="licensePlate"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter License Plate Number"
              required
            />
          </div>

          <!-- Car Photo Upload -->
          <div class="mt-6">
            <label for="carPhoto" class="block text-sm font-medium text-gray-700 mb-2"
              >Upload Car Photo</label
            >
            <input
              id="carPhoto"
              type="file"
              accept="image/*"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              @change="handleCarPhotoUpload"
            />
          </div>

          <!-- Car Photo Preview -->
          <div v-if="formData.carPhotoPreview" class="mt-6 rounded-lg shadow-xl overflow-hidden">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Car Photo Preview:</h4>
            <img
              :src="formData.carPhotoPreview"
              alt="Car Photo Preview"
              class="w-full h-auto object-cover rounded-md transition-transform transform hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
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
        ownerName: '',
        carType: '',
        brand: '',
        model: '',
        year: '',
        chassisNumber: '',
        engineNumber: '',
        engineType: '',
        cc: '',
        licensePlate: '',
        carPhoto: null, // Store the uploaded car photo here
        carPhotoPreview: '', // Store the car photo preview URL here
      },
      customers: [
        // Dummy customer data for the select options
        { name: 'John Doe' },
        { name: 'Maria Sari' },
        { name: 'Ali Rahman' },
        // Add more customers as needed
      ],
    }
  },
  methods: {
    // Handle car photo upload and store the selected file
    handleCarPhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.carPhoto = file

        // Generate a preview URL for the uploaded car image
        const reader = new FileReader()
        reader.onloadend = () => {
          this.formData.carPhotoPreview = reader.result // Store the preview URL
        }
        reader.readAsDataURL(file) // Read the file as a Data URL
      }
    },
    handleSubmit() {
      console.log('Vehicle Form Submitted', this.formData)
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
