<template>
  <div class="container mx-auto mt-10 space-y-4">
    <!-- Toolbar: Search + Tambah -->
    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="relative w-full md:max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari SO, nama pelanggan, HP, plat, mekanik, kasir, status, tanggal…"
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Cari Sales Order"
        />
        <!-- icon search -->
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

      <div class="flex gap-2">
        <button
          v-if="searchQuery"
          type="button"
          class="rounded-xl bg-white px-4 py-2 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          @click="searchQuery = ''"
          title="Bersihkan pencarian"
        >
          Bersihkan
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleTambah"
        >
          <span class="material-symbols-outlined">add</span>
          Tambah Sales Order
        </button>
      </div>
    </div>

    <!-- Info kecil -->
    <p class="text-sm text-gray-500">
      Menampilkan {{ filteredOrders.length }} dari {{ orders.length }} data.
    </p>

    <!-- Tabel untuk layar lebar -->
    <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden hidden md:table">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">No. Sales Order</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nama Pelanggan</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">No. HP</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">No. Polisi Mobil</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Jumlah Tagihan</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Pajak 11%</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Tagihan</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Mekanik</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Kasir</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Tanggal</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in filteredOrders"
          :key="order.id"
          :class="{
            'bg-gray-50': index % 2 === 0,
            'bg-white': index % 2 !== 0,
          }"
        >
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.noSalesOrder }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.namaPelanggan }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.noHp }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.noPolisi }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.jumlahTagihan) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.pajak11) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.totalTagihan) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.mekanik }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.kasir }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.tanggal }}</td>
          <td class="px-6 py-4 text-sm">
            <span :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm">
            <button
              v-if="order.status === 'Invoiced'"
              class="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              @click="handleBayar(order.id)"
              title="Bayar"
            >
              <span class="material-symbols-outlined">point_of_sale</span>
            </button>
            <button
              v-if="order.status === 'Open'"
              class="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
              @click="handleEdit(order.id)"
              title="Edit"
            >
              <span class="material-symbols-outlined">edit_square</span>
            </button>
            <button
              v-if="order.status === 'Paid'"
              class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              @click="handleCetak(order.id)"
              title="Cetak"
            >
              <span class="material-symbols-outlined">print</span>
            </button>
            <button
              class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition mt-2"
              @click="handleDelete(order.id)"
              title="Hapus"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Card per baris untuk layar mobile -->
    <div class="md:hidden">
      <div
        v-for="(order, index) in filteredOrders"
        :key="order.id"
        class="bg-white shadow-md rounded-lg mb-4 p-4"
      >
        <div class="flex justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-700">No. SO: {{ order.noSalesOrder }}</h3>
          <span :class="getStatusClass(order.status)">{{ order.status }}</span>
        </div>
        <p class="text-sm text-gray-600">Pelanggan: {{ order.namaPelanggan }}</p>
        <p class="text-sm text-gray-600">HP: {{ order.noHp }}</p>
        <p class="text-sm text-gray-600">Plat: {{ order.noPolisi }}</p>
        <p class="text-sm text-gray-600">Jumlah: {{ formatCurrency(order.jumlahTagihan) }}</p>
        <p class="text-sm text-gray-600">Pajak 11%: {{ formatCurrency(order.pajak11) }}</p>
        <p class="text-sm text-gray-600">Total: {{ formatCurrency(order.totalTagihan) }}</p>
        <p class="text-sm text-gray-600">Mekanik: {{ order.mekanik }}</p>
        <p class="text-sm text-gray-600">Kasir: {{ order.kasir }}</p>
        <p class="text-sm text-gray-600">Tanggal: {{ order.tanggal }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="order.status === 'Invoiced'"
            class="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition"
            @click="handleBayar(order.id)"
          >
            <span class="material-symbols-outlined">point_of_sale</span> Bayar
          </button>
          <button
            v-if="order.status === 'Open'"
            class="bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 transition"
            @click="handleEdit(order.id)"
          >
            <span class="material-symbols-outlined">edit_square</span> Edit
          </button>
          <button
            v-if="order.status === 'Paid'"
            class="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition"
            @click="handleCetak(order.id)"
          >
            <span class="material-symbols-outlined">print</span> Cetak
          </button>
          <button
            class="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition"
            @click="handleDelete(order.id)"
          >
            <span class="material-symbols-outlined">delete</span> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!filteredOrders.length" class="text-center text-gray-500 py-10">
      Tidak ada data yang cocok dengan pencarian.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      orders: [
        {
          id: 1,
          noSalesOrder: '001',
          namaPelanggan: 'John Doe',
          noHp: '0812345678',
          noPolisi: 'B1234XYZ',
          jumlahTagihan: 500000,
          pajak11: 55000,
          totalTagihan: 555000,
          mekanik: 'Alex',
          kasir: 'Rita',
          tanggal: '2025-08-21',
          status: 'Invoiced',
        },
        {
          id: 2,
          noSalesOrder: '002',
          namaPelanggan: 'Jane Smith',
          noHp: '0812345679',
          noPolisi: 'B5678ABC',
          jumlahTagihan: 300000,
          pajak11: 33000,
          totalTagihan: 333000,
          mekanik: 'Bob',
          kasir: 'Eva',
          tanggal: '2025-08-21',
          status: 'Paid',
        },
        {
          id: 3,
          noSalesOrder: '003',
          namaPelanggan: 'Michael Johnson',
          noHp: '0812345680',
          noPolisi: 'B9101DEF',
          jumlahTagihan: 200000,
          pajak11: 22000,
          totalTagihan: 222000,
          mekanik: 'David',
          kasir: 'Leo',
          tanggal: '2025-08-21',
          status: 'Open',
        },
        {
          id: 4,
          noSalesOrder: '004',
          namaPelanggan: 'Sarah Lee',
          noHp: '0812345681',
          noPolisi: 'B1122GHI',
          jumlahTagihan: 400000,
          pajak11: 44000,
          totalTagihan: 444000,
          mekanik: 'Mark',
          kasir: 'Ian',
          tanggal: '2025-08-21',
          status: 'Invoiced',
        },
      ],
    }
  },
  computed: {
    filteredOrders() {
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return this.orders

      return this.orders.filter((o) => {
        const haystack = [
          o.noSalesOrder,
          o.namaPelanggan,
          o.noHp,
          o.noPolisi,
          o.mekanik,
          o.kasir,
          o.status,
          o.tanggal,
        ]
          .filter(Boolean)
          .join(' | ')
          .toLowerCase()

        return haystack.includes(q)
      })
    },
  },
  methods: {
    handleTambah() {
      this.$router.push('/wo/sales/form')
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
    getStatusClass(status) {
      switch (status) {
        case 'Paid':
          return 'text-green-600 font-semibold'
        case 'Invoiced':
          return 'text-blue-600 font-semibold'
        case 'Open':
          return 'text-yellow-600 font-semibold'
        default:
          return 'text-gray-600'
      }
    },
    handleBayar(id) {
      this.$router.push('/wo/sales/invoice')
    },
    handleEdit(id) {
      this.$router.push('/wo/sales/new')
    },
    handleCetak(id) {
      this.$router.push('/wo/sales/invoice')
    },
    handleDelete(id) {
      alert(`Menghapus Sales Order ID: ${id}`)
    },
  },
}
</script>

<style scoped>
/* optional: kecilkan ikon material agar pas di tombol */
.material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}
</style>
