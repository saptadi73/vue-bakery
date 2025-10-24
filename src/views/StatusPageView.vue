<template>
  <div>
    <div>
      <NavBarPreline />
      <div class="flex">
        <div><SideBarIcon /></div>
        <div class="mx-auto"><RouterView /></div>
      </div>

      <BottomBarIcon />
    </div>
  </div>
</template>

<script setup>
import NavBarPreline from '../components/NavBarPreline.vue'
import BottomBarIcon from '@/components/BottomBarIcon.vue'
import SideBarIcon from '@/components/SideBarIcon.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped></style>
