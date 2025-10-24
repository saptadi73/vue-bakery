<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
      Daftar Pemasukan dan Pengeluaran Barang
    </h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari produk..."
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Daftar Pemasukan dan Pengeluaran Barang - Mobile View as Cards -->
    <div class="block lg:hidden">
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="(item, index) in filteredTransactions"
          :key="index"
          class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm mt-2">Kategori: {{ item.category }}</p>
            <p class="text-gray-600 text-sm">Brand: {{ item.brand }}</p>
            <p class="text-gray-600 text-sm">Type: {{ item.type }}</p>
            <p class="text-gray-600 text-sm">Quantity: {{ item.quantity }} {{ item.uom }}</p>
            <p class="text-gray-600 text-sm">Tanggal: {{ formatDate(item.date) }}</p>
            <p class="text-gray-600 text-sm">Status: {{ item.status }}</p>
            <p class="text-gray-600 text-sm">Stock Terkini: {{ item.stockOnHand }} pcs</p>
            <p class="text-gray-600 text-sm">Penanggung Jawab: {{ item.responsiblePerson }}</p>
            <p class="text-gray-600 text-sm">Keterangan: {{ item.remarks }}</p>

            <!-- Edit and Delete Buttons -->
            <div class="mt-4 flex space-x-2">
              <button
                @click="openEditModal(item)"
                class="py-1 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Edit
              </button>
              <button
                @click="deleteItem(index)"
                class="py-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Daftar Pemasukan dan Pengeluaran Barang - Desktop View as Table -->
    <div class="hidden lg:block">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left">Nama Barang</th>
              <th class="px-4 py-2 text-left">Kategori</th>
              <th class="px-4 py-2 text-left">Brand</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-left">Quantity</th>
              <th class="px-4 py-2 text-left">UOM</th>
              <th class="px-4 py-2 text-left">Tanggal</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Stock Terkini</th>
              <th class="px-4 py-2 text-left">Penanggung Jawab</th>
              <th class="px-4 py-2 text-left">Keterangan</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredTransactions" :key="index">
              <td class="px-4 py-2">{{ item.name }}</td>
              <td class="px-4 py-2">{{ item.category }}</td>
              <td class="px-4 py-2">{{ item.brand }}</td>
              <td class="px-4 py-2">{{ item.type }}</td>
              <td class="px-4 py-2">{{ item.quantity }} {{ item.uom }}</td>
              <td class="px-4 py-2">{{ item.uom }}</td>
              <td class="px-4 py-2">{{ formatDate(item.date) }}</td>
              <td class="px-4 py-2">{{ item.status }}</td>
              <td class="px-4 py-2">{{ item.stockOnHand }} pcs</td>
              <td class="px-4 py-2">{{ item.responsiblePerson }}</td>
              <td class="px-4 py-2">{{ item.remarks }}</td>
              <td class="px-4 py-2 flex space-x-2">
                <button
                  @click="openEditModal(item)"
                  class="py-1 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(index)"
                  class="py-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Editing Pengeluaran or Pemasukan Barang -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Edit Barang</h3>

        <!-- Product Information Form -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Nama Barang</label>
          <input
            v-model="editForm.name"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Kategori</label>
          <input
            v-model="editForm.category"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Brand</label>
          <input
            v-model="editForm.brand"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Type</label>
          <input
            v-model="editForm.type"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Quantity</label>
          <input
            v-model="editForm.quantity"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">UOM (Unit of Measure)</label>
          <input
            v-model="editForm.uom"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Penanggung Jawab</label>
          <select
            v-model="editForm.responsiblePerson"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option v-for="employee in employees" :key="employee.id" :value="employee.name">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Keterangan</label>
          <textarea
            v-model="editForm.remarks"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Tanggal</label>
          <input
            v-model="editForm.date"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeEditModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="submitEdit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Simpan
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
      employees: [
        { id: 1, name: 'Ahmad Budi' },
        { id: 2, name: 'Siti Aisyah' },
        { id: 3, name: 'Joko Santoso' },
        { id: 4, name: 'Maria Ulfa' },
      ],
      transactions: [
        // Pemasukan Barang
        {
          id: 1,
          name: 'Spare Part A',
          category: 'Spare Part',
          brand: 'Brand A',
          type: 'Mechanical',
          quantity: 10,
          uom: 'pcs',
          date: '2025-08-01',
          status: 'Masuk',
          stockOnHand: 10,
          responsiblePerson: 'Ahmad Budi',
          remarks: 'Untuk perbaikan mesin',
        },
        // Pengeluaran Barang
        {
          id: 2,
          name: 'Accesory B',
          category: 'Accesory',
          brand: 'Brand B',
          type: 'Cosmetic',
          quantity: 5,
          uom: 'pcs',
          date: '2025-08-03',
          status: 'Keluar',
          stockOnHand: 5,
          responsiblePerson: 'Siti Aisyah',
          remarks: 'Untuk pemasangan di mobil pelanggan',
        },
        // More data...
      ],
      isEditModalOpen: false,
      editForm: {
        id: null,
        name: '',
        category: '',
        brand: '',
        type: '',
        quantity: 1,
        uom: '',
        responsiblePerson: '',
        remarks: '',
        date: '',
        status: '',
      },
    }
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter((item) => {
        const query = this.searchQuery.toLowerCase()
        return (
          item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
        )
      })
    },
  },
  methods: {
    openEditModal(item) {
      this.editForm = { ...item }
      this.isEditModalOpen = true
    },
    closeEditModal() {
      this.isEditModalOpen = false
      this.editForm = {
        id: null,
        name: '',
        category: '',
        brand: '',
        type: '',
        quantity: 1,
        uom: '',
        responsiblePerson: '',
        remarks: '',
        date: '',
        status: '',
      }
    },
    submitEdit() {
      const index = this.transactions.findIndex((item) => item.id === this.editForm.id)
      if (index !== -1) {
        this.transactions[index] = { ...this.editForm }
      }
      this.closeEditModal()
    },
    deleteItem(index) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.transactions.splice(index, 1)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
  },
}
</script>

<style scoped>
/* Optional: Custom styles to improve table appearance */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f4f7fb;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

input,
select,
textarea {
  border-radius: 8px;
}
</style>
