<template>
  <div class="p-6 space-y-8">
    <!-- Form Header -->
    <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6 font-lexend">
      Customer Registration Form
    </h2>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="formData.name"
              id="name"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <!-- Address Input -->
          <div class="mt-6">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2"
              >Address</label
            >
            <input
              v-model="formData.address"
              id="address"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your address"
              required
            />
          </div>

          <!-- Phone Number Input -->
          <div class="mt-6">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2"
              >Phone Number</label
            >
            <input
              v-model="formData.phone"
              id="phone"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <!-- ID Number Input -->
          <div class="mt-6">
            <label for="idNumber" class="block text-sm font-medium text-gray-700 mb-2"
              >ID Number</label
            >
            <input
              v-model="formData.idNumber"
              id="idNumber"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your ID number"
              required
            />
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Registration Date Input -->
          <div>
            <label for="registrationDate" class="block text-sm font-medium text-gray-700 mb-2"
              >Registration Date</label
            >
            <input
              v-model="formData.registrationDate"
              id="registrationDate"
              type="date"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <!-- Date of Birth Input -->
          <div class="mt-6">
            <label for="dob" class="block text-sm font-medium text-gray-700 mb-2"
              >Date of Birth</label
            >
            <input
              v-model="formData.dob"
              id="dob"
              type="date"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <!-- Email Input -->
          <div class="mt-6">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              id="email"
              type="email"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Photo Upload -->
          <div class="mt-6">
            <label for="photo" class="block text-sm font-medium text-gray-700 mb-2"
              >Upload Photo</label
            >
            <input
              id="photo"
              type="file"
              accept="image/*"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              @change="handleFileUpload"
            />
          </div>

          <!-- Image Preview -->
          <div v-if="formData.photoPreview" class="mt-6 rounded-lg shadow-xl overflow-hidden">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Photo Preview:</h4>
            <img
              :src="formData.photoPreview"
              alt="Preview"
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
        name: '',
        address: '',
        phone: '',
        idNumber: '',
        registrationDate: '',
        dob: '',
        email: '',
        photo: null, // Store the uploaded photo here
        photoPreview: '', // Store the photo preview URL here
      },
    }
  },
  methods: {
    // Handle file upload and store the selected file
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.photo = file

        // Generate a preview URL for the uploaded image
        const reader = new FileReader()
        reader.onloadend = () => {
          this.formData.photoPreview = reader.result // Store the preview URL
        }
        reader.readAsDataURL(file) // Read the file as a Data URL
      }
    },
    handleSubmit() {
      console.log('Form Submitted', this.formData)
      // Process form data (e.g., send to API or display confirmation)
    },
  },
}
</script>

<style scoped>
/* Additional Custom Styling */
input,
button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}

input:focus,
button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}
</style>
