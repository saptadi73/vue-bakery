<template>
  <div class="p-6 space-y-6">
    <h1 class="text-center text-slate-500 font-bold text-2xl ipad-mini:text-3xl font-lexend">
      Table Work Order
    </h1>
    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari Work Order..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Table Work Order (Visible on 2xl screens) -->
    <div class="overflow-x-auto hidden ipad:block">
      <table
        class="min-w-full font-montserrat bg-white border border-gray-300 rounded-lg shadow-md"
      >
        <thead class="bg-gray-100 text-sm">
          <tr>
            <th class="p-3 text-left">#</th>
            <th class="p-3 text-left">No.</th>
            <th class="p-3 text-left">Nama</th>
            <th class="p-3 text-left">No.Pol</th>
            <th class="p-3 text-left">Terdaftar</th>
            <th class="p-3 text-left">Ditangani</th>
            <th class="p-3 text-left">Selesai</th>
            <th class="p-3 text-left">Layanan</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, index) in filteredOrders"
            :key="order.workOrderNumber"
            class="even:bg-slate-100 text-sm"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ order.workOrderNumber }}</td>
            <td class="p-3">{{ order.customerName }}</td>
            <td class="p-3">{{ order.licensePlate }}</td>
            <td class="p-3">{{ order.registerDate }}</td>
            <td class="p-3">{{ order.handledBy }}</td>
            <td class="p-3">{{ order.estimatedFinish }}</td>
            <td class="p-3">{{ order.serviceType }}</td>
            <td
              :class="{
                'bg-green-300': order.status === 'Progress',
                'bg-blue-300 border': order.status === 'Selesai',
              }"
              class="p-3"
            >
              {{ order.status }}
            </td>
            <td class="p-3">
              <button
                @click="showSalesOrder(order)"
                class="bg-blue-500 text-white px-4 py-2 rounded"
              >
                SO
              </button>
              <button
                @click="showRepairNotes(order)"
                class="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Catatan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Work Order as Cards (Visible on smaller screens) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ipad:hidden">
      <div
        v-for="(order, index) in filteredOrders"
        :key="order.workOrderNumber"
        class="bg-white border border-gray-300 rounded-lg shadow-md p-4"
      >
        <div class="font-semibold">#{{ index + 1 }}</div>
        <div class="mt-2"><strong>Nomor Work Order:</strong> {{ order.workOrderNumber }}</div>
        <div><strong>Nama Pelanggan:</strong> {{ order.customerName }}</div>
        <div><strong>No. Polisi:</strong> {{ order.licensePlate }}</div>
        <div><strong>Tanggal Terdaftar:</strong> {{ order.registerDate }}</div>
        <div><strong>Ditangani Oleh:</strong> {{ order.handledBy }}</div>
        <div><strong>Estimasi Selesai:</strong> {{ order.estimatedFinish }}</div>
        <div><strong>Jenis Layanan:</strong> {{ order.serviceType }}</div>
        <!-- Status with conditional color -->
        <div
          :class="{
            'bg-green-500': order.status === 'Progress',
            'bg-blue-500': order.status === 'Selesai',
          }"
          class="text-white text-center font-semibold rounded-full p-2 mt-2"
        >
          {{ order.status }}
        </div>
        <div class="mt-4 2xl:flex gap-2 hidden">
          <button
            @click="showSalesOrder(order)"
            class="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Sales Order
          </button>
          <button
            @click="showRepairNotes(order)"
            class="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Catatan Perbaikan
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Sales Order -->
    <div
      v-if="showSalesOrderModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h2 class="text-2xl font-bold text-center mb-4">
          Sales Order - {{ selectedOrder.workOrderNumber }}
        </h2>

        <!-- Customer Details -->
        <div class="space-y-4 mb-6">
          <h3 class="text-lg font-semibold">Customer Details</h3>
          <div>
            <p><strong>Customer Name:</strong> {{ selectedOrder.customerName }}</p>
            <p><strong>License Plate:</strong> {{ selectedOrder.licensePlate }}</p>
            <p><strong>Work Order Number:</strong> {{ selectedOrder.workOrderNumber }}</p>
          </div>
        </div>

        <!-- Sales Order Items -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Sales Order Items</h3>
          <table class="min-w-full table-auto mb-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Item</th>
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.salesOrder.items" :key="item.name">
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total Estimation -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Total Estimation</h3>
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Subtotal:</span>
            <span>{{ formatCurrency(getTotalPrice()) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Tax (10%):</span>
            <span>{{ formatCurrency(getTotalPrice() * 0.1) }}</span>
          </div>
          <div class="flex justify-between mb-4">
            <span class="font-semibold">Total:</span>
            <span class="text-lg font-bold">{{ formatCurrency(getTotalPrice() * 1.1) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between mt-6">
          <button @click="closeSalesOrderModal" class="bg-red-500 text-white px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Catatan Perbaikan (Buku Bergaris) -->
    <div
      v-if="showRepairNotesModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Catatan Perbaikan untuk {{ selectedOrder.workOrderNumber }}
        </h2>

        <!-- Buku Bergaris -->
        <div
          class="border-2 p-6 bg-gray-50 rounded-lg bg-[url('https://cdn.pixabay.com/photo/2017/08/30/02/47/letter-2695307_960_720.jpg')] bg-cover bg-no-repeat bg-center"
        >
          <div class="overflow-y-auto h-96 p-4 text-gray-800">
            <p class="text-sm">{{ selectedOrder.repairNotes }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button @click="closeRepairNotesModal" class="bg-red-500 text-white px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      showSalesOrderModal: false,
      showRepairNotesModal: false,
      selectedOrder: null,
      orders: [
        {
          workOrderNumber: 'WO001',
          customerName: 'John Doe',
          licensePlate: 'B 1234 XYZ',
          registerDate: '2025-08-20 10:00',
          handledBy: 'Alice',
          estimatedFinish: '2025-08-21 12:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang A', price: 500000 },
              { name: 'Jasa Perbaikan', price: 300000 },
            ],
          },
          repairNotes: 'Mengganti bagian mesin.',
        },
        {
          workOrderNumber: 'WO002',
          customerName: 'Maria Sari',
          licensePlate: 'B 5678 ABC',
          registerDate: '2025-08-19 09:30',
          handledBy: 'Bob',
          estimatedFinish: '2025-08-20 14:00',
          serviceType: 'Modifikasi',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Body Kit', price: 2000000 },
              { name: 'Jasa Modifikasi', price: 1500000 },
            ],
          },
          repairNotes: 'Menambahkan body kit dan aksesori.',
        },
        {
          workOrderNumber: 'WO003',
          customerName: 'Ali Rahman',
          licensePlate: 'L 1234 DEF',
          registerDate: '2025-08-18 15:45',
          handledBy: 'Charlie',
          estimatedFinish: '2025-08-22 10:00',
          serviceType: 'Penggantian Suku Cadang',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang B', price: 800000 },
              { name: 'Jasa Penggantian', price: 400000 },
            ],
          },
          repairNotes: 'Penggantian rem depan.',
        },
        {
          workOrderNumber: 'WO004',
          customerName: 'Tina Amalia',
          licensePlate: 'D 9101 GHI',
          registerDate: '2025-08-17 11:00',
          handledBy: 'David',
          estimatedFinish: '2025-08-19 13:00',
          serviceType: 'Service Rutin',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Oil Filter', price: 150000 },
              { name: 'Jasa Service', price: 500000 },
            ],
          },
          repairNotes: 'Service rutin dan penggantian filter oli.',
        },
        {
          workOrderNumber: 'WO005',
          customerName: 'Budi Setiawan',
          licensePlate: 'E 1023 JKL',
          registerDate: '2025-08-16 14:00',
          handledBy: 'Emma',
          estimatedFinish: '2025-08-18 17:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang C', price: 600000 },
              { name: 'Jasa Perbaikan', price: 350000 },
            ],
          },
          repairNotes: 'Perbaikan mesin dan sistem kelistrikan.',
        },
        {
          workOrderNumber: 'WO006',
          customerName: 'Siti Fatimah',
          licensePlate: 'F 3456 MNO',
          registerDate: '2025-08-15 13:30',
          handledBy: 'Grace',
          estimatedFinish: '2025-08-16 15:00',
          serviceType: 'Modifikasi',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Velg Custom', price: 1200000 },
              { name: 'Jasa Modifikasi', price: 1000000 },
            ],
          },
          repairNotes: 'Modifikasi velg dan cat ulang body mobil.',
        },
        {
          workOrderNumber: 'WO007',
          customerName: 'Rahmad Hidayat',
          licensePlate: 'G 2345 PQR',
          registerDate: '2025-08-14 10:00',
          handledBy: 'Harry',
          estimatedFinish: '2025-08-18 09:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Kampas Rem', price: 250000 },
              { name: 'Jasa Penggantian', price: 200000 },
            ],
          },
          repairNotes: 'Penggantian kampas rem belakang.',
        },
        {
          workOrderNumber: 'WO008',
          customerName: 'Fajar Nugroho',
          licensePlate: 'H 6789 STU',
          registerDate: '2025-08-13 12:30',
          handledBy: 'Ivy',
          estimatedFinish: '2025-08-14 16:00',
          serviceType: 'Service Rutin',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Filter Udara', price: 100000 },
              { name: 'Jasa Service', price: 600000 },
            ],
          },
          repairNotes: 'Pemeriksaan dan penggantian filter udara.',
        },
        {
          workOrderNumber: 'WO009',
          customerName: 'Dewi Lestari',
          licensePlate: 'I 2345 VWX',
          registerDate: '2025-08-12 10:15',
          handledBy: 'Jack',
          estimatedFinish: '2025-08-16 14:00',
          serviceType: 'Modifikasi',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Spoiler', price: 500000 },
              { name: 'Jasa Modifikasi', price: 450000 },
            ],
          },
          repairNotes: 'Menambah spoiler dan pengaturan aerodinamis.',
        },
        {
          workOrderNumber: 'WO010',
          customerName: 'Eko Prasetyo',
          licensePlate: 'J 7890 YZ',
          registerDate: '2025-08-11 09:45',
          handledBy: 'Liam',
          estimatedFinish: '2025-08-13 12:00',
          serviceType: 'Penggantian Suku Cadang',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Busi', price: 150000 },
              { name: 'Jasa Penggantian', price: 200000 },
            ],
          },
          repairNotes: 'Penggantian busi dan pembersihan sistem pembakaran.',
        },

        // Add more orders if needed
      ],
    }
  },
  computed: {
    filteredOrders() {
      const searchText = this.searchQuery.toLowerCase()
      return this.orders.filter((order) => {
        return (
          order.workOrderNumber.toLowerCase().includes(searchText) ||
          order.customerName.toLowerCase().includes(searchText) ||
          order.licensePlate.toLowerCase().includes(searchText)
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

    // Calculate the total price for the order
    getTotalPrice() {
      return this.selectedOrder.salesOrder.items.reduce((total, item) => total + item.price, 0)
    },

    closeSalesOrderModal() {
      this.showSalesOrderModal = false
    },

    showSalesOrder(order) {
      this.selectedOrder = order
      this.showSalesOrderModal = true
    },

    showRepairNotes(order) {
      this.selectedOrder = order
      this.showRepairNotesModal = true
    },

    closeRepairNotesModal() {
      this.showRepairNotesModal = false
    },
  },
}
</script>

<style scoped>
/* TailwindCSS styles for the modal */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.bg-opacity-75 {
  background-color: rgba(0, 0, 0, 0.75);
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 8px;
}

.p-6 {
  padding: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-semibold {
  font-weight: 600;
}

.mt-4 {
  margin-top: 1rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-green-500 {
  background-color: #10b981;
}

.text-white {
  color: white;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
