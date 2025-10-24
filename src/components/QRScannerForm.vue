<template>
  <div class="container mx-auto py-8 mt-10 ipad-mini:mt-15 flex items-center justify-center">
    <div class="flex flex-wrap justify-center">
      <div
        class="grid p-5 ipad-mini:grid-cols-2 ipad-mini:gap-4 bg-white border shadow-sm rounded-xl"
      >
        <div class="w-[80vw] ipad-mini:w-[35vw] p-2 rounded-lg">
          <qr-code-scanner />
        </div>
        <div class="w-[80vw] ipad-mini:w-[35vw] p-2 bg-green-100 rounded-t-lg">
          <div>
            <div>
              <img
                src="../assets/images/scanner_ayam.png"
                alt="scanner ayam ternak"
                class="p-2 rounded-t-3xl"
              />
            </div>
            <div>
              <p class="font-poppins text-center">
                Arahkan camera ke label QR Code yang ada atau terpasang di kandang atau ternak untuk
                mendapatkan informasi terkait dengan riwayat perawatan, kinerja produksi, dan status
                kesehatan ternak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrCodeScanner from './QrCodeScanner.vue'
</script>

<style lang="scss" scoped></style>
