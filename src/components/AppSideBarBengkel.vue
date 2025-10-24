<template>
  <div class="flex flex-col h-full">
    <div class="p-4 flex justify-center items-center h-[100px]">
      <img class="h-12 w-auto" src="../assets/images/icon_bengkel_tnp.png" alt="" />
    </div>
    <nav class="scrollbar pb-4 px-4 flex-auto overflow-y-auto h-[calc(100vh-100px)]">
      <SideMenuBengkel></SideMenuBengkel>
    </nav>
  </div>
</template>

<script setup>
import SideMenuBengkel from '../components/SideMenuBengkel.vue'
</script>
