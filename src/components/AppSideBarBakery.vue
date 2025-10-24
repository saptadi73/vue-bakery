<template>
  <div class="flex flex-col h-full">
    <div class="p-4 flex justify-center items-center h-[100px]">
      <img class="h-12 w-12 rounded-full" src="../assets/images/yummy_cake.png" alt="" />
    </div>
    <nav class="scrollbar pb-4 px-4 flex-auto overflow-y-auto h-[calc(100vh-100px)]">
      <side-menu-bakery />
    </nav>
  </div>
</template>

<script setup>
import SideMenuBakery from './SideMenuBakery.vue'
</script>
