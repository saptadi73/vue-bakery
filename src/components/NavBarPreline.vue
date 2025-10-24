<template>
  <nav class="navbar bg-transparent fixed w-full top-0 left-0 z-50">
    <div class="navbar-container">
      <div class="navbar-logo">
        <div class="flex items-center">
          <div>
            <img
              src="../assets/images/icon_ayam_sapi_kambing_ikan.png"
              class="h-8 w-8 rounded-full"
            />
          </div>
          <div class="flex items-center">
            <div class="px-2 text-3xl text-white font-extrabold font-lexend">
              <span>ERP</span>
            </div>
            <div class="flex flex-col gap-[0.01px] text-white">
              <span class="text-xs font-bold font-lexend">Peternakan</span>
              <span class="text-xs font-bold font-lexend">Perikanan</span>
            </div>
          </div>
        </div>
      </div>
      <button class="navbar-toggle" @click="toggleMobileMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <ul :class="['navbar-menu', { active: mobileMenuOpen }]">
        <li><a href="/" class="text-white drop-shadow font-medium">Home</a></li>
        <li
          class="dropdown"
          @mouseenter="openDropdown('about')"
          @mouseleave="closeDropdown('about')"
        >
          <a
            href="#"
            @click.prevent="toggleDropdown('about')"
            class="text-white drop-shadow font-medium"
            >DashBoard Kinerja<span class="arrow">▼</span></a
          >
          <ul v-if="dropdownOpen.about" class="dropdown-menu">
            <li><a href="/kinerja/petani" class="text-gray-800">Petani/Peternak</a></li>
            <li><a href="/kinerja/karamba" class="text-gray-800">Karamba</a></li>
            <li><a href="/kinerja/sapi" class="text-gray-800">Ternak</a></li>
            <li><a href="/kinerja/dashboard/ikan" class="text-gray-800">Dashboard Perikanan</a></li>
            <li>
              <a href="/kinerja/dashboard/ternak" class="text-gray-800">Dashboard Peternakan</a>
            </li>
            <li>
              <a href="/kinerja/dashboard/sapisusu" class="text-gray-800">Dashboard Susu Perah</a>
            </li>
          </ul>
        </li>
        <li class="dropdown" @mouseenter="openDropdown('menu')" @mouseleave="closeDropdown('menu')">
          <a
            href="#"
            @click.prevent="toggleDropdown('menu')"
            class="text-white drop-shadow font-medium"
            >Produksi<span class="arrow">▼</span></a
          >
          <ul v-if="dropdownOpen.menu" class="dropdown-menu">
            <li><a href="/produksi/inventory" class="text-gray-800">Inventory</a></li>
            <li><a href="/produksi/hasil" class="text-gray-800">Produksi</a></li>
            <li><a href="/produksi/penjualan" class="text-gray-800">Penjualan</a></li>
          </ul>
        </li>

        <!-- Dropdown baru: Laporan Keuangan -->
        <li
          class="dropdown"
          @mouseenter="openDropdown('finance')"
          @mouseleave="closeDropdown('finance')"
        >
          <a
            href="#"
            @click.prevent="toggleDropdown('finance')"
            class="text-white drop-shadow font-medium"
            >Keuangan<span class="arrow">▼</span></a
          >
          <ul v-if="dropdownOpen.finance" class="dropdown-menu">
            <li><a href="/keuangan/neraca" class="text-gray-800">Neraca</a></li>
            <li><a href="/keuangan/labarugi" class="text-gray-800">Laba Rugi</a></li>
            <li><a href="/keuangan/aruskas" class="text-gray-800">Arus Kas</a></li>
          </ul>
        </li>

        <li>
          <a href="/#hubungi" class="text-white drop-shadow font-medium">Contact</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBarMenu',
  data() {
    return {
      mobileMenuOpen: false,
      dropdownOpen: {
        about: false,
        menu: false,
        finance: false,
      },
      isMobile: window.innerWidth <= 767,
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      // Tutup semua dropdown saat menu utama ditutup
      if (!this.mobileMenuOpen) {
        this.dropdownOpen.about = false
        this.dropdownOpen.menu = false
      }
    },
    toggleDropdown(menu) {
      if (this.isMobile) {
        this.dropdownOpen[menu] = !this.dropdownOpen[menu]
      }
    },
    openDropdown(menu) {
      if (!this.isMobile) {
        this.dropdownOpen[menu] = true
      }
    },
    closeDropdown(menu) {
      if (!this.isMobile) {
        this.dropdownOpen[menu] = false
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 767
      if (!this.isMobile) {
        this.dropdownOpen.about = false
        this.dropdownOpen.menu = false
        this.mobileMenuOpen = false
      }
    },
  },
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, rgb(25, 3, 135) 0%, rgb(89, 4, 162) 50%, rgb(3, 28, 49) 100%);
  border-bottom: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}
.navbar-logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.navbar-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  border: none;
  background: none;
}
.bar {
  width: 25px;
  height: 3px;
  background: white;
  margin: 4px 0;
  transition: 0.4s;
}
.navbar-menu {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}
.navbar-menu li {
  position: relative;
}
.navbar-menu a {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  display: block;
  font-weight: 500;
  transition: color 0.2s;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.navbar-menu a:hover {
  color: #60a5fa;
}
.dropdown-menu {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(67, 10, 114, 0.96);
  min-width: 180px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border-radius: 0 0 14px 14px;
  z-index: 100;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.dropdown-menu li a {
  padding: 0.75rem 1.25rem;
  white-space: nowrap;
  color: #fff;
  font-weight: 500;
  transition:
    background 0.2s,
    color 0.2s;
}
.dropdown-menu li a:hover {
  background: rgba(96, 165, 250, 0.18);
  color: #60a5fa;
}
.arrow {
  font-size: 0.7em;
  margin-left: 0.2em;
}
@media (max-width: 767px) {
  .navbar-toggle {
    display: flex;
  }
  .navbar-menu {
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: rgba(6, 33, 112, 0.92);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  }
  .navbar-menu.active {
    max-height: 500px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  }
  .navbar-menu a {
    color: #fff !important;
  }
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
