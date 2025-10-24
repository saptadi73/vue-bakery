<template>
  <div class="container mx-auto py-8 mt-35 flex items-center justify-center">
    <div class="flex flex-wrap justify-center">
      <div
        class="grid p-5 ipad-mini:grid-cols-2 ipad-mini:gap-4 bg-white border shadow-sm rounded-xl"
      >
        <div class="w-[80vw] ipad-mini:w-[30vw] p-2 rounded-lg">
          <qr-code-generator />
        </div>
        <div class="w-[80vw] ipad-mini:w-[30vw] bg-green-100 mt-5 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrCodeGenerator from './QrCodeGenerator.vue'
</script>

<style lang="scss" scoped></style>
