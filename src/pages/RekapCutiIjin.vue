<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
      Rekapitulasi Cuti, Ijin, dan Keterlambatan Karyawan
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

    <!-- Table for Leave Recap -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Nama Karyawan</th>
            <th class="px-4 py-2 text-left">Cuti yang Sudah Diambil</th>
            <th class="px-4 py-2 text-left">Sisa Hari Cuti</th>
            <th class="px-4 py-2 text-left">Jumlah Ijin yang Sudah Diambil</th>
            <th class="px-4 py-2 text-left">Jumlah Hari Keterlambatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in filteredEmployees" :key="index">
            <td class="px-4 py-2">{{ employee.name }}</td>
            <td class="px-4 py-2">{{ employee.takenLeave }} hari</td>
            <td class="px-4 py-2">{{ employee.remainingLeave }} hari</td>
            <td class="px-4 py-2">{{ employee.takenPermission }} hari</td>
            <td class="px-4 py-2">{{ employee.lateDays }} hari</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Leave Button -->
    <div class="mt-6">
      <button
        @click="openLeaveModal"
        class="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Tambah Cuti
      </button>
      <button
        @click="openLateModal"
        class="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Tambah Keterlambatan
      </button>
    </div>

    <!-- Modal for Adding Leave -->
    <div
      v-if="isLeaveModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Permintaan Cuti</h3>

        <!-- Employee Name -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Nama Karyawan</label>
          <select
            v-model="leaveForm.employeeName"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option v-for="employee in employees" :key="employee.id" :value="employee.name">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <!-- Cuti yang Diambil -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Hari Cuti yang Diambil</label>
          <input
            v-model="leaveForm.takenLeave"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <!-- Ijin yang Diambil -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Hari Ijin yang Diambil</label>
          <input
            v-model="leaveForm.takenPermission"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeLeaveModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="submitLeave"
            class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Simpan Cuti
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Late -->
    <div
      v-if="isLateModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Tambah Keterlambatan</h3>

        <!-- Employee Name -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Nama Karyawan</label>
          <select
            v-model="lateForm.employeeName"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option v-for="employee in employees" :key="employee.id" :value="employee.name">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <!-- Jumlah Hari Keterlambatan -->
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Jumlah Hari Keterlambatan</label>
          <input
            v-model="lateForm.lateDays"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeLateModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="submitLate"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Simpan Keterlambatan
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
      isLeaveModalOpen: false,
      isLateModalOpen: false,
      leaveForm: {
        employeeName: '',
        takenLeave: 1,
        takenPermission: 1,
      },
      lateForm: {
        employeeName: '',
        lateDays: 1,
      },
      employees: [
        {
          id: 1,
          name: 'Ahmad Budi',
          totalLeave: 12,
          takenLeave: 0,
          remainingLeave: 12,
          takenPermission: 0,
          lateDays: 0,
        },
        {
          id: 2,
          name: 'Siti Aisyah',
          totalLeave: 12,
          takenLeave: 0,
          remainingLeave: 12,
          takenPermission: 0,
          lateDays: 0,
        },
        {
          id: 3,
          name: 'Joko Santoso',
          totalLeave: 12,
          takenLeave: 0,
          remainingLeave: 12,
          takenPermission: 0,
          lateDays: 0,
        },
        {
          id: 4,
          name: 'Maria Ulfa',
          totalLeave: 12,
          takenLeave: 0,
          remainingLeave: 12,
          takenPermission: 0,
          lateDays: 0,
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
    openLeaveModal() {
      this.isLeaveModalOpen = true
    },
    closeLeaveModal() {
      this.isLeaveModalOpen = false
      this.leaveForm = {
        employeeName: '',
        takenLeave: 1,
        takenPermission: 1,
      }
    },
    submitLeave() {
      const employee = this.employees.find((emp) => emp.name === this.leaveForm.employeeName)
      if (employee) {
        employee.takenLeave += this.leaveForm.takenLeave
        employee.remainingLeave = employee.totalLeave - employee.takenLeave
        employee.takenPermission += this.leaveForm.takenPermission
      }
      this.closeLeaveModal()
    },

    openLateModal() {
      this.isLateModalOpen = true
    },
    closeLateModal() {
      this.isLateModalOpen = false
      this.lateForm = {
        employeeName: '',
        lateDays: 1,
      }
    },
    submitLate() {
      const employee = this.employees.find((emp) => emp.name === this.lateForm.employeeName)
      if (employee) {
        employee.lateDays += this.lateForm.lateDays
      }
      this.closeLateModal()
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
