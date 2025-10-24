<!-- components/LoadingOverlay.vue -->
<template>
  <div
    v-if="loadingStore.isLoading"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="text-center">
      <img
        src="../assets/images/loading.png"
        alt="Loading..."
        class="w-24 h-24 mx-auto animate-spin"
      />
      <p class="mt-2 text-slate-500 text-sm">Loading, please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '../stores/loading'
const loadingStore = useLoadingStore()
</script>
