<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50"
  >
    <div
      class="bg-white rounded-2xl shadow-xl border border-blue-100 p-10 flex flex-col items-center gap-6 max-w-md w-full"
    >
      <span class="inline-block bg-blue-100 p-4 rounded-full shadow-md animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
          />
        </svg>
      </span>
      <h2 class="text-2xl font-bold text-blue-700 font-lexend text-center">Anda telah logout</h2>
      <p class="text-gray-600 text-center">
        Terima kasih telah menggunakan aplikasi kami.<br />
        Silakan login kembali untuk mengakses fitur.
      </p>
      <button
        @click="goToLogin"
        class="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
      >
        Kembali ke Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  // Bersihkan token dan data user
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('email')
  // Redirect ke halaman login
  router.push({ name: 'login' })
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
