<template>
  <div class="container mx-auto py-8 mt-10 ipad-mini:mt-15 flex items-center justify-center">
    <div class="flex flex-wrap justify-center">
      <div
        class="grid p-5 ipad-mini:grid-cols-2 ipad-mini:gap-4 bg-white border shadow-sm rounded-xl"
      >
        <div class="w-[80vw] ipad-mini:w-[35vw] p-2 rounded-lg">
          <qr-code-generator />
        </div>
        <div class="w-[80vw] ipad-mini:w-[35vw] p-2 bg-green-100 rounded-lg">
          <div class="text-center p-2">
            <p class="font-poppins">
              QR Code Generator untuk menghasil sample QR Code yang bisa untuk lakukan test scanner.
              Untuk melakukan test scanner apakah sesuai ketika dilakukan scanner dengan tulisan
              yang kita encode ke dalam QR Code.
            </p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrCodeGenerator from './QrCodeGenerator.vue'
</script>

<style lang="scss" scoped></style>
