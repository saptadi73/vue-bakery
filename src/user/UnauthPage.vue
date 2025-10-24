<template>
  <main
    class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8"
  >
    <div class="text-center">
      <p class="text-base font-semibold text-indigo-600">MOHON MAAF</p>
      <h1
        class="mt-4 text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-3xl"
      >
        Anda Tidak Diperkenankan Masuk ke Halaman Ini
      </h1>
      <p
        class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
      >
        Untuk melanjutkan dan mencoba ke halaman lain silakan kembali ke dashboard atau Relogin.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/Dashboard"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Dashboard</a
        >
      </div>
      <div class="mt-2 flex items-center justify-center gap-x-6">
        <a
          href="/login"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Login</a
        >
      </div>
    </div>
  </main>
</template>

<script setup></script>

<style lang="scss" scoped></style>
