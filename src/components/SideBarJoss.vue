<template>
  <div>
    <!-- Start Side Bar -->
    <div
      :class="{
        'w-14': !isiSidebar,
        'w-60': isiSidebar,
      }"
      class="z-10 bg-gradient-to-r font-Poppins from-purple-200 to-slate-100 pl-3 h-[100vh] w-14 transition-transform duration-500 relative"
    >
      <span
        @click="openSidebar"
        class="material-symbols-outlined transition-transform duration-500 cursor-pointer bg-purple-700 text-white border border-purple-800 rounded-full absolute -right-3 top-9"
        :class="{
          'rotate-180': !isiSidebar,
          'rotate-0': isiSidebar,
        }"
        >arrow_back</span
      >
      <div
        class="flex items-center bg-gradient-to-r from-purple-200 to-white rounded-r-lg space-x-2"
      >
        <img src="../assets/images/icon_ayam_sapi_kambing.png" class="w-10 h-10 rounded-full" />
        <div v-if="isiSidebar" class="flex items-center gap-1">
          <h1 class="">
            <span class="font-extrabold text-3xl">ERP</span>
          </h1>
          <div>
            <div class="flex flex-col gap-[0.01px]">
              <span class="text-xs font-bold font-lexend">Peternakan</span>
              <span class="text-xs font-bold font-lexend">Perikanan</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center cursor-pointer ml-3 mt-6">
        <router-link to="/dashboard">
          <span class="material-symbols-outlined text-[#e52bf1] w-12 h-12">dashboard</span>
          <span v-if="isiSidebar" class="text-blue-600 text-base">Dashboard</span></router-link
        >
      </div>
      <div v-for="menu in menus" :key="menu.title" class="mt-4">
        <div class="flex justify-between hover:bg-slate-100 rounded-md">
          <div @click="toggleSubmenu(menu)" class="flex items-center cursor-pointer ml-3 mt-4">
            <span class="material-symbols-outlined text-[#e52bf1]">{{ menu.icon }}</span>
            <span v-if="isiSidebar" class="ml-2 text-blue-600">{{ menu.title }}</span>
          </div>
          <span
            v-if="isiSidebar && menu.submenu"
            :class="{
              'rotate-180': menu.submenu && menu.open,
              'rotate-0': !menu.submenu && menu.open,
            }"
            class="material-symbols-outlined text-blue-600 right-2 mt-4"
            >arrow_drop_down</span
          >
        </div>

        <ul
          v-if="menu.open && menu.submenu && isiSidebar"
          class="text-[#0824a1] bg-yellow-200 rounded-md ml-6 z-10"
        >
          <li
            v-for="sub in menu.submenu"
            :key="sub.name"
            class="hover:bg-slate-100 hover:font-semibold p-1"
          >
            <RouterLink :to="sub.path" class="block">{{ sub.name }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isiSidebar: false,
      menus: [
        {
          title: 'Profile',
          icon: 'settings_accessibility',
          submenu: [
            {
              name: 'Profile RT/RW',
              path: '/profile/input',
            },
            {
              name: 'Isi Map Wilayah',
              path: '/profile/input/polygon',
            },
            {
              name: 'Pendaftaran User',
              path: '/profile/register/user',
            },
          ],
          open: false,
        },
        {
          title: 'Warga',
          path: '/warga',
          icon: 'group',
          submenu: [
            {
              name: 'Isi Blok/No. Baru',
              path: '/warga/input/blok',
            },
            {
              name: 'Daftar KK',
              path: '/warga/daftar/kk',
            },
            {
              name: 'Isi Jenis Pekerjaan',
              path: '/warga/input/pekerjaan',
            },
            {
              name: 'Isi Status Warga',
              path: '/warga/input/status',
            },
            {
              name: 'Registrasi Jenis Warga',
              path: '/warga/input/type',
            },
          ],
          open: false,
        },
        {
          title: 'Iuran Warga',
          path: '/iuran',
          icon: 'wallet',
          submenu: [
            {
              path: '/iuran/bayar/iuran',
              name: 'Bayar Iuran Warga',
            },
            {
              name: 'Tambah Jenis iuran',
              path: '/iuran/input/jenis',
            },
            {
              name: 'Warga iuran',
              path: '/iuran/warga/sudah',
            },
            {
              name: 'Warga Belum Iuran',
              path: '/iuran/warga/belum',
            },
          ],
          open: false,
        },
        {
          title: 'Arus Kas Umum',
          path: '/anggaran',
          icon: 'account_balance',
          submenu: [
            {
              name: 'Pencatatan Kas',
              path: '/anggaran/input/anggaran',
            },
            {
              name: 'Isi Jenis Pemasukan',
              path: '/anggaran/input/jenis/anggaran/masuk',
            },
            {
              name: 'Isi Jenis Pengeluaran',
              path: '/anggaran/input/jenis/anggaran/keluar',
            },
          ],
        },
      ],
    }
  },
  methods: {
    openSidebar() {
      this.isiSidebar = !this.isiSidebar
    },

    toggleSubmenu(menu) {
      menu.open = !menu.open
    },
  },
}
</script>

<style scoped>
@media (max-width: 768px) {
  .w-64 {
    width: 100%;
  }
}
</style>
