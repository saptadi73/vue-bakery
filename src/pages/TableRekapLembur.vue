<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
      Rekapitulasi Lembur dan Insentif Karyawan
    </h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari karyawan..."
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Table for Overtime Recap -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Nama Karyawan</th>
            <th class="px-4 py-2 text-left">Tanggal Lembur</th>
            <th class="px-4 py-2 text-left">Total Jam Lembur</th>
            <th class="px-4 py-2 text-left">Upah Insentif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in filteredEmployees" :key="index">
            <td class="px-4 py-2">{{ employee.name }}</td>
            <td class="px-4 py-2">{{ formatDate(employee.overtimeDate) }}</td>
            <td class="px-4 py-2">{{ employee.totalOvertimeHours }}</td>
            <td class="px-4 py-2">{{ formatCurrency(employee.overtimePay) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Overtime Button -->
    <div class="mt-6">
      <button
        @click="openOvertimeModal"
        class="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Tambah Lembur
      </button>
    </div>

    <!-- Modal for Adding Overtime -->
    <div
      v-if="isOvertimeModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Permintaan Lembur</h3>

        <!-- Employee Name -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Nama Karyawan</label>
          <select
            v-model="overtimeForm.employeeName"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option v-for="employee in employees" :key="employee.id" :value="employee.name">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <!-- Overtime Hours -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Jam Lembur</label>
          <input
            v-model="overtimeForm.overtimeHours"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <!-- Overtime Date -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Tanggal Lembur</label>
          <input
            v-model="overtimeForm.overtimeDate"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeOvertimeModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="submitOvertime"
            class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Simpan Lembur
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
      isOvertimeModalOpen: false,
      overtimeForm: {
        employeeName: '',
        overtimeHours: 1,
        overtimeDate: '', // New field for overtime date
      },
      employees: [
        {
          id: 1,
          name: 'Ahmad Budi',
          overtimeRate: 50000,
          totalOvertimeHours: 0,
          overtimePay: 0,
          overtimeDate: '',
        },
        {
          id: 2,
          name: 'Siti Aisyah',
          overtimeRate: 60000,
          totalOvertimeHours: 0,
          overtimePay: 0,
          overtimeDate: '',
        },
        {
          id: 3,
          name: 'Joko Santoso',
          overtimeRate: 55000,
          totalOvertimeHours: 0,
          overtimePay: 0,
          overtimeDate: '',
        },
        {
          id: 4,
          name: 'Maria Ulfa',
          overtimeRate: 70000,
          totalOvertimeHours: 0,
          overtimePay: 0,
          overtimeDate: '',
        },
      ],
    }
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter((employee) => {
        const query = this.searchQuery.toLowerCase()
        return employee.name.toLowerCase().includes(query)
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
      return date ? new Date(date).toLocaleDateString('id-ID') : ''
    },
    openOvertimeModal() {
      this.isOvertimeModalOpen = true
    },
    closeOvertimeModal() {
      this.isOvertimeModalOpen = false
      this.overtimeForm = {
        employeeName: '',
        overtimeHours: 1,
        overtimeDate: '',
      }
    },
    submitOvertime() {
      const employee = this.employees.find((emp) => emp.name === this.overtimeForm.employeeName)
      if (employee) {
        employee.totalOvertimeHours += this.overtimeForm.overtimeHours
        employee.overtimePay = employee.totalOvertimeHours * employee.overtimeRate
        employee.overtimeDate = this.overtimeForm.overtimeDate // Set overtime date
      }
      this.closeOvertimeModal()
    },
  },
}
</script>

<style scoped>
/* Optional: Custom styles to improve the table and modal appearance */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
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
select {
  border-radius: 8px;
}
</style>
