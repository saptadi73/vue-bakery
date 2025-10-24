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
    url: '/',
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
    text: 'Pelanggan',
    url: '/pelanggan',
    icon: 'fa-solid fa-user-tie',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Daftar Pelanggan',
        url: '/pelanggan/all',
      },
      {
        text: 'Registrasi Pemilik',
        url: '/pelanggan/baru',
      },
      {
        text: 'Registrasi Kendaraan',
        url: '/pelanggan/mobil',
      },
      {
        text: 'Service Reminder',
        url: '/pelanggan/reminder',
      },
    ],
  },
  {
    text: 'Work Order',
    url: '/wo',
    icon: 'fa-solid fa-clipboard-check',
    open: false,
    haschildren: true,
    title: false,
    children: [
      {
        text: 'Daftar WO',
        url: '/wo/all',
        badge: {
          text: 20,
          style: '',
        },
      },
      {
        text: 'Buat WO Baru',
        url: '/wo/new/form',
      },
      {
        text: 'Daftar Penjualan',
        url: '/wo/sales/list',
      },
      {
        text: 'Buat SPK',
        url: '/wo/new/spk',
      },
      {
        text: 'Penjualan Barang',
        url: '/wo/laporan/barang',
      },
      {
        text: 'Penjualan Jasa',
        url: '/wo/laporan/jasa',
      },
    ],
  },
  {
    text: 'Pegawai',
    url: '/karyawan',
    icon: 'fa-solid fa-users-between-lines',
    open: false,
    haschildren: true,
    title: false,
    children: [
      {
        text: 'Daftar Karyawan',
        url: '/karyawan/list',
      },
      {
        text: 'Daftar Absen',
        url: '/karyawan/absen',
        badge: {
          text: 10,
          style: '',
        },
      },
      {
        text: 'Rekap Kehadiran',
        url: '/karyawan/kehadiran',
        badge: {
          text: 10,
          style: '',
        },
      },
      {
        text: 'Rekap Lembur',
        url: '/karyawan/lemburku',
      },
    ],
  },
  {
    text: 'Inventory',
    url: '/inventory',
    icon: 'fa-solid fa-cart-flatbed',
    open: false,
    badge: {
      text: 10,
      style: '',
    },
    haschildren: true,
    title: false,
    children: [
      {
        text: 'Daftar Barang',
        url: '/inventory/list',
      },
      {
        text: 'Laporan Pengeluaran',
        url: '/inventory/keluar',
      },
      {
        text: 'Laporan Pemasukan',
        url: '/inventory/masuk',
      },
      {
        text: 'Laporan Pembelian',
        url: '/inventory/pembelian',
      },
      {
        text: 'Laporan Pergerakan',
        url: '/inventory/gerak',
      },
      {
        text: 'Adjustment',
        url: '/inventory/adjust',
      },
    ],
  },
  {
    text: 'Finansial',
    url: '/finansial',
    icon: 'fa-solid fa-cash-register',
    open: false,
    title: false,
    haschildren: true,
    children: [
      {
        text: 'Cash',
        url: '/finansial/cashflow',
      },
      {
        text: 'Biaya',
        url: '/finansial/biaya',
      },
      {
        text: 'Laba Rugi',
        url: '/finansial/labarugi',
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
        url: '/register',
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
