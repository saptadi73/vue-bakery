<template>
  <div
    class="qr-container flex flex-col items-center justify-center p-12 bg-gradient-to-br from-green-400 via-blue-500 to-teal-600 rounded-xl shadow-xl max-w-xl mx-auto"
  >
    <h2 class="title text-3xl font-extrabold text-white mb-6 text-center">QR Code Generator</h2>

    <!-- Input untuk teks/URL -->
    <input
      v-model="inputText"
      type="text"
      placeholder="Masukkan teks atau URL"
      class="input-field px-4 py-3 w-full max-w-md border-2 border-green-400 rounded-xl text-lg font-medium outline-none transition-all duration-300 focus:border-teal-400 bg-white"
    />

    <!-- Komponen QR Code -->
    <qrcode-vue
      v-if="inputText"
      :value="inputText"
      :size="size"
      level="H"
      class="qr-code mt-6 p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 animate-pulse"
    />

    <!-- Pesan jika input kosong -->
    <div v-else class="placeholder mt-6 text-gray-500 italic text-lg text-center">
      Masukkan teks untuk menampilkan QR Code
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

export default defineComponent({
  components: { QrcodeVue },
  setup() {
    const inputText = ref('https://vuejs.org/') // Default URL
    const size = ref(250) // Ukuran QR Code (px)

    return { inputText, size }
  },
})
</script>
