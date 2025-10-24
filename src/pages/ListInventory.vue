<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 font-poppins text-center">Inventory</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari produk..."
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Daftar Produk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="(product, index) in filteredProducts"
        :key="index"
        class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:scale-110 hover:transition transition-transform transform duration-300"
      >
        <!-- Card Product -->
        <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 font-montserrat">
            {{ product.name }}
          </h3>
          <p class="text-gray-600 text-sm mt-2 font-lexend">Kategori: {{ product.category }}</p>
          <p class="text-gray-600 text-sm font-lexend">Stock: {{ product.stockOnHand }} pcs</p>
          <p class="text-gray-600 text-sm font-lexend">Type: {{ product.type }}</p>
          <p class="text-gray-600 text-sm font-lexend">Brand: {{ product.brand }}</p>
          <p class="text-gray-600 text-sm font-lexend">
            Sales: {{ formatCurrency(product.salesPrice) }}
          </p>
          <p class="text-gray-600 text-sm font-lexend">Cost: {{ formatCurrency(product.cost) }}</p>
          <p class="text-gray-600 text-sm font-lexend">
            Last Stock-In: {{ formatDate(product.lastStockIn) }}
          </p>
          <p class="text-gray-600 text-sm font-lexend">
            Last Stock-Out: {{ formatDate(product.lastStockOut) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ban_turanza from '../assets/images/Ban_Bridgestone_Turanza_.png'
import velg from '../assets/images/Velg_Racing_R15_HSR.png'
import kampas_rem from '../assets/images/kampas_rem_avanza.png'
import filter_oli from '../assets/images/filter_oli_innova.png'
import accu from '../assets/images/accu_gs_55d23l.png'
import busi from '../assets/images/busi_ngk_iridium.png'
import shockbecker from '../assets/images/shock_belakang_avanza.png'
import radiator from '../assets/images/radiator_hinda_jazz.png'
import klakson from '../assets/images/klakson_twintone_hella.png'
import fan_belt from '../assets/images/fan_belt_avanza.png'
import kopling_set from '../assets/images/kopling_set_avanza.png'
import spion from '../assets/images/kaca_spion_rush.png'
import lampu from '../assets/images/lampu_depan_fortuner.png'
import knalpot from '../assets/images/Racing_Knalpot_Jazz.png'
import wiper from '../assets/images/wiper_avanza.png'
import door_handle from '../assets/images/Gagang_Pintu_Chrome_Innova.png'
import sensor from '../assets/images/Sensor_Oksigen_Avanza.png'
import ecu from '../assets/images/ECU_Honda Brio.png'
import thermostat from '../assets/images/Thermostat_avanza.png'
import bearing from '../assets/images/Bearing_Roda_Xenia.png'

export default {
  data() {
    return {
      searchQuery: '',
      products: [
        {
          id: 1,
          name: 'Kampas Rem Depan Avanza',
          category: 'Spare Part Rem',
          stockOnHand: 40,
          cost: 250000,
          salesPrice: 325000,
          lastStockIn: '2025-08-01',
          lastStockOut: '2025-08-12',
          type: 'Brake Pad',
          brand: 'Toyota Genuine Parts',
          image: kampas_rem,
        },
        {
          id: 2,
          name: 'Filter Oli Innova',
          category: 'Spare Part Mesin',
          stockOnHand: 60,
          cost: 85000,
          salesPrice: 120000,
          lastStockIn: '2025-08-05',
          lastStockOut: '2025-08-11',
          type: 'Oil Filter',
          brand: 'Denso',
          image: filter_oli,
        },
        {
          id: 3,
          name: 'Aki GS Astra 55D23L',
          category: 'Spare Part Kelistrikan',
          stockOnHand: 25,
          cost: 1100000,
          salesPrice: 1350000,
          lastStockIn: '2025-07-29',
          lastStockOut: '2025-08-09',
          type: 'Battery',
          brand: 'GS Astra',
          image: accu,
        },
        {
          id: 4,
          name: 'Busi Iridium NGK',
          category: 'Spare Part Pengapian',
          stockOnHand: 120,
          cost: 95000,
          salesPrice: 10500,
          lastStockIn: '2025-08-03',
          lastStockOut: '2025-08-10',
          type: 'Spark Plug',
          brand: 'NGK',
          image: busi,
        },
        {
          id: 5,
          name: 'Shockbreaker Belakang Xenia',
          category: 'Spare Part Suspensi',
          stockOnHand: 15,
          cost: 750000,
          salesPrice: 1000000,
          lastStockIn: '2025-08-06',
          lastStockOut: '2025-08-11',
          type: 'Shock Absorber',
          brand: 'Kayaba',
          image: shockbecker,
        },
        {
          id: 6,
          name: 'Radiator Honda Jazz',
          category: 'Spare Part Pendingin',
          stockOnHand: 10,
          cost: 1500000,
          salesPrice: 1700000,
          lastStockIn: '2025-08-02',
          lastStockOut: '2025-08-10',
          type: 'Radiator',
          brand: 'Denso',
          image: radiator,
        },
        {
          id: 7,
          name: 'Klakson Hella Twin Tone',
          category: 'Spare Part Kelistrikan',
          stockOnHand: 50,
          cost: 350000,
          salesPrice: 420000,
          lastStockIn: '2025-08-07',
          lastStockOut: '2025-08-13',
          type: 'Horn',
          brand: 'Hella',
          image: klakson,
        },
        {
          id: 8,
          name: 'Fan Belt Avanza',
          category: 'Spare Part Mesin',
          stockOnHand: 70,
          cost: 120000,
          salesPrice: 135000,
          lastStockIn: '2025-07-30',
          lastStockOut: '2025-08-12',
          type: 'V-Belt',
          brand: 'Mitsuboshi',
          image: fan_belt,
        },
        {
          id: 9,
          name: 'Kopling Set Avanza',
          category: 'Spare Part Transmisi',
          stockOnHand: 18,
          cost: 2200000,
          salesPrice: 2450000,
          lastStockIn: '2025-08-01',
          lastStockOut: '2025-08-11',
          type: 'Clutch Kit',
          brand: 'Exedy',
          image: kopling_set,
        },
        {
          id: 10,
          name: 'Kaca Spion Toyota Rush',
          category: 'Spare Part Body',
          stockOnHand: 22,
          cost: 650000,
          salesPrice: 825000,
          lastStockIn: '2025-08-04',
          lastStockOut: '2025-08-12',
          type: 'Side Mirror',
          brand: 'Toyota Genuine Parts',
          image: spion,
        },
        {
          id: 11,
          name: 'Lampu Depan LED Fortuner',
          category: 'Spare Part Penerangan',
          stockOnHand: 14,
          cost: 1900000,
          salesPrice: 2200000,
          lastStockIn: '2025-07-28',
          lastStockOut: '2025-08-09',
          type: 'Headlamp',
          brand: 'Osram',
          image: lampu,
        },
        {
          id: 12,
          name: 'Knalpot Racing Jazz',
          category: 'Spare Part Knalpot',
          stockOnHand: 9,
          cost: 3200000,
          salesPrice: 3300000,
          lastStockIn: '2025-08-02',
          lastStockOut: '2025-08-10',
          type: 'Exhaust',
          brand: 'HKS',
          image: knalpot,
        },
        {
          id: 13,
          name: 'Ban Bridgestone Turanza 195/65 R15',
          category: 'Spare Part Ban',
          stockOnHand: 35,
          cost: 950000,
          salesPrice: 1250000,
          lastStockIn: '2025-08-05',
          lastStockOut: '2025-08-12',
          type: 'Tire',
          brand: 'Bridgestone',
          image: ban_turanza,
        },
        {
          id: 14,
          name: 'Velg Racing R15 HSR',
          category: 'Spare Part Ban',
          stockOnHand: 12,
          cost: 4500000,
          salesPrice: 5100000,
          lastStockIn: '2025-07-31',
          lastStockOut: '2025-08-11',
          type: 'Alloy Wheel',
          brand: 'HSR',
          image: velg,
        },
        {
          id: 15,
          name: 'Wiper Blade Avanza',
          category: 'Spare Part Aksesoris',
          stockOnHand: 100,
          cost: 85000,
          salesPrice: 120000,
          lastStockIn: '2025-08-08',
          lastStockOut: '2025-08-13',
          type: 'Wiper',
          brand: 'Bosch',
          image: wiper,
        },
        {
          id: 16,
          name: 'Door Handle Chrome Innova',
          category: 'Spare Part Body',
          stockOnHand: 27,
          cost: 550000,
          salesPrice: 600000,
          lastStockIn: '2025-08-01',
          lastStockOut: '2025-08-10',
          type: 'Door Handle',
          brand: 'Toyota Genuine Parts',
          image: door_handle,
        },
        {
          id: 17,
          name: 'Sensor Oksigen Avanza',
          category: 'Spare Part Sensor',
          stockOnHand: 11,
          cost: 1750000,
          salesPrice: 2100000,
          lastStockIn: '2025-08-06',
          lastStockOut: '2025-08-12',
          type: 'O2 Sensor',
          brand: 'Denso',
          image: sensor,
        },
        {
          id: 18,
          name: 'ECU Honda Brio',
          category: 'Spare Part Elektronik',
          stockOnHand: 6,
          cost: 7500000,
          salesPrice: 10000000,
          lastStockIn: '2025-08-03',
          lastStockOut: '2025-08-09',
          type: 'Engine Control Unit',
          brand: 'Honda',
          image: ecu,
        },
        {
          id: 19,
          name: 'Bearing Roda Depan Xenia',
          category: 'Spare Part Suspensi',
          stockOnHand: 30,
          cost: 480000,
          salesPrice: 512500,
          lastStockIn: '2025-07-30',
          lastStockOut: '2025-08-11',
          type: 'Wheel Bearing',
          brand: 'SKF',
          image: bearing,
        },
        {
          id: 20,
          name: 'Thermostat Toyota Avanza',
          category: 'Spare Part Pendingin',
          stockOnHand: 45,
          cost: 350000,
          salesPrice: 415000,
          lastStockIn: '2025-08-05',
          lastStockOut: '2025-08-12',
          type: 'Thermostat',
          brand: 'Toyota Genuine Parts',
          image: thermostat,
        },
      ],
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const query = this.searchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      })
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
  },
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
