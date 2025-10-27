<template>
  <ul class="space-y-1">
    <li v-for="(item, index) in navItems" :key="item">
      <div @click="!item.title && haddleSubMenu(index)">
        <span
          v-if="item.title === true"
          class="mt-2.5 block text-[14px] font-medium text-white text-opacity-30 px-3 py-2"
          >{{ item.text }}</span
        >
        <SideMenuParentItem
          v-else
          :item="item"
          active-class="bg-warning bg-opacity-5 hover:text-opacity-100"
          class="w-full flex items-center text-left rounded-md px-4 py-2 text-sm font-normal text-white text-opacity-60 hover:text-opacity-100 hover:bg-gray-400 hover:bg-opacity-50 transform duration-200"
        ></SideMenuParentItem>
      </div>
      <ul
        :data-submenu="index"
        :data-submenu-open="item.open"
        v-if="item.haschildren === true"
        class="max-h-0 overflow-hidden transition-all duration-300"
      >
        <li v-for="subItem in item.children" :key="subItem" class="mt-1">
          <SideMenuSubItem :subItem="subItem"></SideMenuSubItem>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import SideMenuParentItem from '../components/SideMenuParentItem.vue'
import SideMenuSubItem from '../components/SideMenuSubItem.vue'
import { reactive, inject } from 'vue'
const $emitter = inject('$emitter')

import { useScreenSize } from '@/composables/useScreenSize.js'
const { isMobile } = useScreenSize()

const navItems = reactive([
  {
    text: 'Dashboard',
    url: '/main/dashboard',
    icon: 'fa-solid fa-house',
    open: false,
    badge: {
      text: 'New',
      style: 'bg-red-900 text-white',
    },
    title: false,
    haschildren: false,
  },
  {
    text: 'Produk',
    url: '/produk',
    icon: 'fa-solid fa-cake-candles',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Daftar Produk Kue',
        url: '/produk/list',
      },
    ],
  },
  {
    text: 'Outlet',
    url: '/outlet',
    icon: 'fa-solid fa-store',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Daftar Outlet',
        url: '/outlet/list',
      },
    ],
  },
  {
    text: 'Order',
    url: '/order',
    icon: 'fa-solid fa-cart-shopping',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Order Produk',
        url: '/order/all',
      },
      {
        text: 'List Order',
        url: '/order/list',
      },
      {
        text: 'Create Order',
        url: '/order/create',
      },
      {
        text: 'Order Summary Per Produk',
        url: '/order/summary',
      },
    ],
  },
  {
    text: 'Kitchen',
    url: '/kitchen',
    icon: 'fa-solid fa-kitchen-set',
    open: false,
    haschildren: true,
    title: false,
    children: [
      {
        text: 'Create Stock',
        url: '/kitchen/stock',
        // badge: {
        //   text: 20,
        //   style: '',
        // },
      },
      {
        text: 'adjustment',
        url: '/kitchen/adjustment',
      },
      {
        text: 'summary',
        url: '/produk/summary',
      },
    ],
  },
  {
    path: 'delivery',
    text: 'Delivery',
    url: '/delivery',
    icon: 'fa-solid fa-truck-fast',
    open: false,
    haschildren: true,
    title: false,
    children: [
      {
        text: 'Delivery Orders',
        url: '/delivery/orders',
      },
      {
        text: 'Distribusi Produk',
        url: '/delivery/group',
      },
    ],
  },
  {
    text: 'Users',
    url: '/users',
    icon: 'fa-solid fa-users',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Login',
        url: '/login',
      },
      {
        text: 'Register',
        url: '/user/register',
      },
    ],
  },
])

const haddleSubMenu = (index) => {
  document.querySelectorAll('ul[data-submenu-open="true"]').forEach((submenu) => {
    submenu.style.maxHeight = null
  })

  if (document.querySelectorAll(`ul[data-submenu="${index}"]`).length > 0) {
    document.querySelectorAll(`ul[data-submenu="${index}"]`).forEach((subMenu) => {
      let subMenuHeight = subMenu.scrollHeight

      if (subMenu.getAttribute('data-submenu-open') === 'true') {
        subMenu.style.maxHeight = null
      } else {
        subMenu.style.maxHeight = subMenuHeight + 'px'
      }
    })
  } else {
    if (isMobile.value === true) {
      $emitter.emit('haddleSidebar')
    }
  }

  navItems.forEach((item, i) => {
    if (i === index) {
      item.open = !item.open
    } else {
      item.open = false
    }
  })
}
</script>
