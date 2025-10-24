<template>
  <div class="flex">
    <div
      :class="[sidebarOpen ? '' : '-ml-64']"
      class="w-64 bg-teal-950 flex-none transition-all duration-300 fixed z-50"
    >
      <AppSideBarBakery />
    </div>
    <div
      class="lg:hidden fixed left-0 top-0 w-64 h-full z-40 bg-teal-950 bg-opacity-20 transition-all duration-300"
      :class="[sidebarOpen ? 'visible' : 'hidden']"
      @click="haddleSidebar"
    ></div>
    <div
      :class="[sidebarOpen ? 'lg:ml-64' : 'lg:ml-0']"
      class="min-h-screen flex flex-col transition-all duration-300 grow"
    >
      <AppHeaderBakery />

      <div class="p-4 xl:p-6 flex-auto">
        <DashboardBakery />
      </div>
      <AppFooter></AppFooter>
    </div>
  </div>
</template>

<script setup>
import AppHeaderBakery from '@/components/AppHeaderBakery.vue'
import AppFooter from '../components/AppFooter.vue'
import AppSideBarBakery from '@/components/AppSideBarBakery.vue'
import DashboardBakery from '@/pages/DashboardBakery.vue'

import { useScreenSize } from '@/composables/useScreenSize.js'
const { sidebarOpen } = useScreenSize()
import { inject } from 'vue'

const $emitter = inject('$emitter')

const haddleSidebar = () => {
  console.log('fddg')
  sidebarOpen.value = !sidebarOpen.value
}

$emitter.on('haddleSidebar', haddleSidebar)
</script>
