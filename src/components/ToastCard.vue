<template>
  <transition name="fade">
    <div
      v-if="message_toast"
      class="fixed left-1/2 top-24 transform -translate-x-1/2 z-50 max-w-xs w-full font-Poppins bg-gradient-to-r from-green-400 via-green-500 to-teal-400 text-white rounded-xl shadow-2xl shadow-green-300/40 border border-green-600 animate-pop p-5"
    >
      <div class="flex items-center gap-3">
        <span class="inline-block bg-white/20 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span class="flex-1 text-base font-semibold">{{ message_toast }}</span>
        <button
          type="button"
          class="inline-flex justify-center items-center size-8 rounded-full bg-white/20 text-white hover:bg-white/40 hover:text-green-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
          @click="$emit('close')"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message_toast: String,
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-pop {
  animation: pop 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
@keyframes pop {
  0% {
    transform: scale(0.8) translateY(-10px);
    opacity: 0;
  }
  80% {
    transform: scale(1.05) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
