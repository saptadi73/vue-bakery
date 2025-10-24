<template>
  <router-link
    :to="subItem.url"
    exact-active-class="bg-white bg-opacity-5 hover:text-opacity-100"
    class="w-full flex items-center text-left rounded-md px-4 py-2 text-sm font-normal text-white text-opacity-60 hover:text-opacity-100 hover:bg-gray-400 hover:bg-opacity-10 transform duration-200"
    @click="isMobile && $emitter.emit('haddleSidebar')"
  >
    <font-awesome-icon icon="fa-solid fa-circle" class="text-[4px] w-8 -ml-2.5" />
    <span class="flex-auto">{{ subItem.text }}</span>
    <span
      v-if="subItem.badge"
      :class="[subItem.badge.style !== '' ? subItem.badge.style : 'bg-gray-500 bg-opacity-10']"
      class="flex items-center justify-center text-[11px] px-1.5 rounded-sm h-[20px] leading-[20px] shadow-sm"
    >
      {{ subItem.badge.text }}
    </span>
  </router-link>
</template>

<script setup>
// Directly defining the prop without assigning it to a variable
defineProps(['subItem'])

import { inject } from 'vue'
const $emitter = inject('$emitter')

import { useScreenSize } from '@/composables/useScreenSize.js'
const { isMobile } = useScreenSize()
</script>
