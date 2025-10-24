<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Daftar Pelanggan & Servis</h2>
          <p class="text-white/90 text-sm">
            Pantau riwayat dan jadwal servis berikutnya secara cepat.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span> Aman
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-amber-400"></span> Dekat Jatuh Tempo
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-rose-400"></span> Terlambat
          </span>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div class="lg:col-span-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pelanggan, plat, model, alamat..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <!-- search icon -->
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Status</option>
          <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <select
          v-model="filterBrand"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Brand</option>
          <option v-for="b in brandOptions" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <div
        v-for="(customer, index) in filteredCustomers"
        :key="index"
        class="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 hover:shadow-xl transition"
      >
        <!-- Photo badge -->
        <div class="absolute z-20 top-4 left-4">
          <img
            :src="customer.photo"
            alt="Customer"
            class="h-14 w-14 rounded-full border-4 border-white shadow-lg ring-2 ring-white/60"
          />
        </div>

        <!-- Cover car -->
        <div class="relative">
          <img :src="customer.carPhoto" alt="Car" class="w-full h-56 object-cover" />
          <!-- status badge -->
          <div class="absolute top-4 right-4">
            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md"
              :class="{
                'bg-blue-600': customer.status === 'Selesai',
                'bg-emerald-600': customer.status === 'Progress',
                'bg-gray-700': customer.status === 'Tidak dalam Antrean',
              }"
            >
              <span class="h-2 w-2 rounded-full bg-white"></span>
              {{ customer.status }}
            </span>
          </div>

          <!-- gradient overlay on hover -->
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"
          ></div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 leading-tight">{{ customer.name }}</h3>
              <p class="text-sm text-gray-500">{{ customer.address }}</p>
            </div>
            <!-- brand & type chip -->
            <div class="text-right">
              <div class="mb-1">
                <span
                  class="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >{{ customer.brand }}</span
                >
              </div>
              <span
                class="inline-block rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600"
                >{{ customer.carType }}</span
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
            <div><span class="font-medium">Model:</span> {{ customer.model }}</div>
            <div><span class="font-medium">Plat:</span> {{ customer.licensePlate }}</div>
            <div><span class="font-medium">Tahun:</span> {{ customer.tahun }}</div>
            <div><span class="font-medium">Telepon:</span> {{ customer.phone }}</div>
          </div>

          <!-- Service timeline -->
          <div class="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <!-- wrench icon -->
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 3a7 7 0 0 1-9.8 6.4l-6.8 6.8a2 2 0 1 1-2.8-2.8l6.8-6.8A7 7 0 1 1 21 3Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <span class="text-sm font-semibold text-gray-800">Servis</span>
              </div>
              <span
                class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                :class="servicePillClass(customer)"
                :title="serviceTitle(customer)"
              >
                <span class="h-2 w-2 rounded-full bg-white"></span>
                {{ serviceBadge(customer) }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-white p-3 ring-1 ring-gray-100">
                <div class="text-[11px] text-gray-500">Last Service</div>
                <div class="font-medium text-gray-900">{{ formatDate(customer._lastService) }}</div>
              </div>
              <div class="rounded-lg bg-white p-3 ring-1 ring-gray-100">
                <div class="text-[11px] text-gray-500">Next Service</div>
                <div class="font-medium" :class="nextServiceTextClass(customer)">
                  {{ formatDate(customer._nextService) }}
                </div>
              </div>
            </div>

            <div class="mt-2 text-[12px] text-gray-500">
              {{ serviceNote(customer) }}
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex items-center gap-2">
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <!-- bell -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 1 1 12 0v4l1.5 3H4.5L6 12V8Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M10 19a2 2 0 1 0 4 0"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Ingatkan
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-gray-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <!-- pencil -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path d="M14.06 6.19l3.75 3.75" stroke="currentColor" stroke-width="1.5" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!filteredCustomers.length" class="text-center text-gray-500">
      Tidak ada data yang cocok.
    </p>
  </div>
</template>

<script>
import avanza from '../assets/images/avanza.webp'
import crv from '../assets/images/crv.png'
import fiesta from '../assets/images/fiesta.webp'
import ertiga from '../assets/images/ertiga.webp'
import m4 from '../assets/images/bmw_m4.avif'
import a_class from '../assets/images/a_class.jpg'
import d_max from '../assets/images/d_max.jpg'
import sorrento from '../assets/images/sorrento.avif'
import cx5 from '../assets/images/cx5.jpg'
import march from '../assets/images/march.jpg'
import outlander from '../assets/images/outlander.jpeg'
import civic from '../assets/images/civic.png'

export default {
  name: 'CustomerCard',
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      filterBrand: '',
      customers: [
        {
          name: 'John Doe',
          address: 'Jl. Merdeka No. 123, Jakarta',
          phone: '08123456789',
          carType: 'Sedan',
          brand: 'Toyota',
          model: 'Avanza',
          licensePlate: 'B 1234 XYZ',
          status: 'Tidak dalam Antrean',
          tahun: '2022',
          photo: 'https://randomuser.me/api/portraits/men/1.jpg',
          carPhoto: avanza,
          lastService: '2025-06-10',
          nextService: '2025-09-10',
        },
        {
          name: 'Maria Sari',
          address: 'Jl. Kebon Jeruk No. 45, Bandung',
          phone: '08233445566',
          carType: 'SUV',
          brand: 'Honda',
          model: 'CRV',
          licensePlate: 'B 5678 ABC',
          status: 'Selesai',
          tahun: '2021',
          photo: 'https://randomuser.me/api/portraits/women/1.jpg',
          carPhoto: crv,
          lastService: '2025-05-15',
          // nextService sengaja dikosongkan -> dihitung otomatis +3 bulan
        },
        {
          name: 'Ali Rahman',
          address: 'Jl. Raya No. 88, Surabaya',
          phone: '08334566788',
          carType: 'Hatchback',
          brand: 'Ford',
          model: 'Fiesta',
          licensePlate: 'L 1234 DEF',
          status: 'Progress',
          tahun: '2023',
          photo: 'https://randomuser.me/api/portraits/men/2.jpg',
          carPhoto: fiesta,
          lastService: '2025-07-01',
          nextService: '2025-10-01',
        },
        {
          name: 'Tina Amalia',
          address: 'Jl. Anggrek No. 56, Yogyakarta',
          phone: '08555667799',
          carType: 'MPV',
          brand: 'Suzuki',
          model: 'Ertiga',
          licensePlate: 'D 9101 GHI',
          status: 'Selesai',
          tahun: '2022',
          photo: 'https://randomuser.me/api/portraits/women/2.jpg',
          carPhoto: ertiga,
          lastService: '2025-06-20',
          nextService: '2025-09-20',
        },
        {
          name: 'Budi Setiawan',
          address: 'Jl. Sinar No. 78, Medan',
          phone: '08776543210',
          carType: 'Coupe',
          brand: 'BMW',
          model: 'M4',
          licensePlate: 'E 1023 JKL',
          status: 'Tidak dalam Antrean',
          tahun: '2021',
          photo: 'https://randomuser.me/api/portraits/men/3.jpg',
          carPhoto: m4,
          lastService: '2025-04-30',
          nextService: '2025-07-30',
        },
        {
          name: 'Siti Fatimah',
          address: 'Jl. Raya Timur No. 12, Malang',
          phone: '08987654321',
          carType: 'Convertible',
          brand: 'Mercedes',
          model: 'A-Class',
          licensePlate: 'F 3456 MNO',
          status: 'Selesai',
          tahun: '2020',
          photo: 'https://randomuser.me/api/portraits/women/3.jpg',
          carPhoto: a_class,
          lastService: '2025-05-05',
          nextService: '2025-08-05',
        },
        {
          name: 'Rahmad Hidayat',
          address: 'Jl. Duta No. 21, Bali',
          phone: '08127876543',
          carType: 'Pickup',
          brand: 'Isuzu',
          model: 'D-Max',
          licensePlate: 'G 2345 PQR',
          status: 'Progress',
          tahun: '2023',
          photo: 'https://randomuser.me/api/portraits/men/4.jpg',
          carPhoto: d_max,
          lastService: '2025-07-10',
          // nextService auto
        },
        {
          name: 'Fajar Nugroho',
          address: 'Jl. Kartini No. 54, Jakarta',
          phone: '08567890123',
          carType: 'Wagon',
          brand: 'Kia',
          model: 'Sorrento',
          licensePlate: 'H 6789 STU',
          status: 'Tidak dalam Antrean',
          tahun: '2022',
          photo: 'https://randomuser.me/api/portraits/men/5.jpg',
          carPhoto: sorrento,
          lastService: '2025-06-01',
          nextService: '2025-09-01',
        },
        {
          name: 'Dewi Lestari',
          address: 'Jl. Alam No. 99, Tangerang',
          phone: '08123567890',
          carType: 'Crossover',
          brand: 'Mazda',
          model: 'CX-5',
          licensePlate: 'I 2345 VWX',
          status: 'Progress',
          tahun: '2021',
          photo: 'https://randomuser.me/api/portraits/women/4.jpg',
          carPhoto: cx5,
          lastService: '2025-05-28',
          nextService: '2025-08-28',
        },
        {
          name: 'Eko Prasetyo',
          address: 'Jl. Merpati No. 22, Solo',
          phone: '08234567890',
          carType: 'Hatchback',
          brand: 'Nissan',
          model: 'March',
          licensePlate: 'J 7890 YZ',
          status: 'Selesai',
          tahun: '2022',
          photo: 'https://randomuser.me/api/portraits/men/6.jpg',
          carPhoto: march,
          lastService: '2025-06-15',
          // nextService auto
        },
        {
          name: 'Joko Widodo',
          address: 'Jl. Panglima Polim No. 5, Jakarta',
          phone: '08123456700',
          carType: 'SUV',
          brand: 'Mitsubishi',
          model: 'Outlander',
          licensePlate: 'D 3030 ABC',
          status: 'Progress',
          tahun: '2020',
          photo: 'https://randomuser.me/api/portraits/men/7.jpg',
          carPhoto: outlander,
          lastService: '2025-04-05',
          nextService: '2025-07-05',
        },
        {
          name: 'Putri Ayu',
          address: 'Jl. Padma No. 9, Bali',
          phone: '08123678912',
          carType: 'Sedan',
          brand: 'Honda',
          model: 'Civic',
          licensePlate: 'E 4040 DEF',
          status: 'Selesai',
          tahun: '2021',
          photo: 'https://randomuser.me/api/portraits/women/5.jpg',
          carPhoto: civic,
          lastService: '2025-06-25',
          // nextService auto
        },
      ],
    }
  },
  computed: {
    // opsi filter dinamis dari data
    statusOptions() {
      const set = new Set(this.customers.map((c) => c.status))
      return Array.from(set)
    },
    brandOptions() {
      const set = new Set(this.customers.map((c) => c.brand))
      return Array.from(set).sort()
    },
    // hasil akhir: cari + filter + mapping tanggal & indikator
    filteredCustomers() {
      const q = this.searchQuery.trim().toLowerCase()
      const now = new Date()

      return (
        this.customers
          .map((c) => this.withComputedService(c)) // pastikan _lastService & _nextService ada
          .filter((c) => {
            // search
            const matchText =
              c.name.toLowerCase().includes(q) ||
              c.address.toLowerCase().includes(q) ||
              c.carType.toLowerCase().includes(q) ||
              c.brand.toLowerCase().includes(q) ||
              c.model.toLowerCase().includes(q) ||
              c.licensePlate.toLowerCase().includes(q) ||
              c.phone.toLowerCase().includes(q)

            // filter dropdown
            const matchStatus = this.filterStatus ? c.status === this.filterStatus : true
            const matchBrand = this.filterBrand ? c.brand === this.filterBrand : true

            return (q ? matchText : true) && matchStatus && matchBrand
          })
          // urutkan: yang paling mendesak di atas
          .sort((a, b) => {
            const da = this.daysUntil(a._nextService, now)
            const db = this.daysUntil(b._nextService, now)
            return da - db
          })
      )
    },
  },
  methods: {
    // menambahkan 3 bulan dengan aman (memperhatikan rollover tanggal)
    addMonths(dateStr, months = 3) {
      const d = new Date(dateStr)
      const day = d.getDate()
      d.setMonth(d.getMonth() + months)

      // jika bulan bergeser (contoh 31 -> Feb), set ke akhir bulan
      if (d.getDate() < day) {
        d.setDate(0)
      }
      return d.toISOString().slice(0, 10)
    },
    withComputedService(c) {
      const last = c.lastService ? c.lastService : null
      const next = c.nextService ? c.nextService : last ? this.addMonths(last, 3) : null

      // buat salinan + field internal untuk tampilan
      return {
        ...c,
        _lastService: last,
        _nextService: next,
      }
    },
    daysUntil(dateStr, now = new Date()) {
      if (!dateStr) return Infinity
      const d = new Date(dateStr)
      return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
    },
    // UI Helpers
    serviceState(customer) {
      if (!customer._nextService) return { state: 'unknown', days: Infinity }
      const days = this.daysUntil(customer._nextService)
      if (days < 0) return { state: 'overdue', days }
      if (days <= 14) return { state: 'dueSoon', days }
      return { state: 'ok', days }
    },
    serviceBadge(customer) {
      const s = this.serviceState(customer)
      if (s.state === 'overdue') return 'Terlambat'
      if (s.state === 'dueSoon') return 'Segera Servis'
      if (s.state === 'ok') return 'Aman'
      return '—'
    },
    servicePillClass(customer) {
      const s = this.serviceState(customer)
      return {
        'bg-rose-600': s.state === 'overdue',
        'bg-amber-500': s.state === 'dueSoon',
        'bg-emerald-600': s.state === 'ok',
        'bg-gray-400': s.state === 'unknown',
      }
    },
    nextServiceTextClass(customer) {
      const s = this.serviceState(customer)
      return {
        'text-rose-600 font-semibold': s.state === 'overdue',
        'text-amber-600 font-semibold': s.state === 'dueSoon',
        'text-gray-900': s.state === 'ok',
        'text-gray-400': s.state === 'unknown',
      }
    },
    serviceTitle(customer) {
      const s = this.serviceState(customer)
      if (s.state === 'overdue') return 'Lewat dari jadwal servis'
      if (s.state === 'dueSoon') return 'Mendekati jadwal servis'
      if (s.state === 'ok') return 'Jadwal servis masih aman'
      return 'Jadwal servis tidak tersedia'
    },
    serviceNote(customer) {
      const s = this.serviceState(customer)
      if (!customer._nextService) return 'Jadwal servis belum ditentukan.'
      if (s.state === 'overdue')
        return `Lewat ${Math.abs(s.days)} hari dari jadwal. Disarankan segera servis.`
      if (s.state === 'dueSoon') return `Sisa ${s.days} hari menuju jadwal servis.`
      return `Sekitar ${s.days} hari menuju jadwal servis berikutnya.`
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
/* Sentuhan halus untuk fokus ring di Safari/Firefox */
:focus-visible {
  outline: none;
}
</style>
