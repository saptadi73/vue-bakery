<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Daftar Kehadiran Karyawan</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari karyawan, tanggal, atau keterangan..."
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Table for Employee Attendance -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Nama Karyawan</th>
            <th class="px-4 py-2 text-left">Tanggal</th>
            <th class="px-4 py-2 text-left">Jam Check-in</th>
            <th class="px-4 py-2 text-left">Jam Check-out</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Keterangan</th>
            <th class="px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attendance, index) in filteredAttendance" :key="index">
            <td class="px-4 py-2">{{ attendance.employeeName }}</td>
            <td class="px-4 py-2">{{ attendance.date }}</td>
            <td class="px-4 py-2">{{ attendance.checkIn }}</td>
            <td class="px-4 py-2">{{ attendance.checkOut }}</td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'bg-green-500': attendance.status === 'Tepat Waktu',
                  'bg-red-500': attendance.status === 'Terlambat',
                }"
                class="inline-block px-3 py-1 text-white text-sm font-semibold rounded-full"
              >
                {{ attendance.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              {{ attendance.description || '-' }}
            </td>
            <td class="px-4 py-2">
              <!-- Buttons for Overtime, Leave, Sick Leave -->
              <div class="space-x-2">
                <button
                  @click="openOvertimeModal(attendance)"
                  class="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Lembur
                </button>
                <button
                  @click="openLeaveModal(attendance)"
                  class="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Izin
                </button>
                <button
                  @click="openSickLeaveModal(attendance)"
                  class="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Cuti
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Attendance Button -->
    <div class="mt-6">
      <button
        @click="openAttendanceModal"
        class="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Tambah Kehadiran
      </button>
    </div>

    <!-- Modal for Adding Overtime -->
    <div
      v-if="isOvertimeModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Permintaan Lembur</h3>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Sampai Jam Berapa?</label>
          <input
            v-model="overtimeForm.overtimeUntil"
            type="time"
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

    <!-- Modal for Leave -->
    <div
      v-if="isLeaveModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Permintaan Izin</h3>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Tanggal Izin</label>
          <input
            v-model="leaveForm.leaveDate"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Jam Izin</label>
          <input
            v-model="leaveForm.leaveTime"
            type="time"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Berapa Hari?</label>
          <input
            v-model="leaveForm.leaveDays"
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
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Simpan Izin
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Sick Leave -->
    <div
      v-if="isSickLeaveModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Permintaan Cuti</h3>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Tanggal Cuti</label>
          <input
            v-model="sickLeaveForm.sickLeaveDate"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Berapa Hari?</label>
          <input
            v-model="sickLeaveForm.sickLeaveDays"
            type="number"
            min="1"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-700">Sisa Cuti yang Tersisa</label>
          <input
            v-model="sickLeaveForm.remainingLeave"
            type="text"
            readonly
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeSickLeaveModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="submitSickLeave"
            class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Simpan Cuti
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
      isModalOpen: false,
      isOvertimeModalOpen: false,
      isLeaveModalOpen: false,
      isSickLeaveModalOpen: false,
      overtimeForm: {
        overtimeUntil: '',
      },
      leaveForm: {
        leaveDate: '',
        leaveTime: '',
        leaveDays: 1,
      },
      sickLeaveForm: {
        sickLeaveDate: '',
        sickLeaveDays: 1,
        remainingLeave: '', // to show the remaining leave days
      },
      attendanceForm: {
        employeeName: '',
        date: '',
        checkIn: '',
        checkOut: '',
        status: 'Tepat Waktu',
        description: '',
      },
      employees: [
        { id: 1, name: 'Ahmad Budi', remainingLeave: 5 }, // Add remaining leave for each employee
        { id: 2, name: 'Siti Aisyah', remainingLeave: 10 },
        { id: 3, name: 'Joko Santoso', remainingLeave: 8 },
        { id: 4, name: 'Maria Ulfa', remainingLeave: 7 },
      ],
      attendance: [
        {
          employeeName: 'Ahmad Budi',
          date: '2025-08-21',
          checkIn: '08:00',
          checkOut: '17:00',
          status: 'Tepat Waktu',
        },
        {
          employeeName: 'Siti Aisyah',
          date: '2025-08-21',
          checkIn: '09:00',
          checkOut: '17:00',
          status: 'Terlambat',
          description: 'Terlambat - Izin',
        },
      ],
    }
  },
  computed: {
    filteredAttendance() {
      return this.attendance.filter((record) => {
        const query = this.searchQuery.toLowerCase()
        return (
          record.employeeName.toLowerCase().includes(query) ||
          record.date.includes(query) ||
          record.checkIn.includes(query) ||
          record.checkOut.includes(query) ||
          (record.description && record.description.toLowerCase().includes(query))
        )
      })
    },
  },
  methods: {
    openAttendanceModal() {
      this.isModalOpen = true
    },
    closeAttendanceModal() {
      this.isModalOpen = false
      this.attendanceForm = {
        employeeName: '',
        date: '',
        checkIn: '',
        checkOut: '',
        status: 'Tepat Waktu',
        description: '',
      }
    },
    openOvertimeModal() {
      this.isOvertimeModalOpen = true
    },
    closeOvertimeModal() {
      this.isOvertimeModalOpen = false
      this.overtimeForm = {
        overtimeUntil: '',
      }
    },
    openLeaveModal() {
      this.isLeaveModalOpen = true
    },
    closeLeaveModal() {
      this.isLeaveModalOpen = false
      this.leaveForm = {
        leaveDate: '',
        leaveTime: '',
        leaveDays: 1,
      }
    },
    openSickLeaveModal() {
      this.isSickLeaveModalOpen = true
      this.sickLeaveForm.remainingLeave = this.getRemainingLeave(this.sickLeaveForm.employeeName) // Set remaining leave
    },
    closeSickLeaveModal() {
      this.isSickLeaveModalOpen = false
      this.sickLeaveForm = {
        sickLeaveDate: '',
        sickLeaveDays: 1,
        remainingLeave: '',
      }
    },
    submitAttendance() {
      this.attendance.push({ ...this.attendanceForm })
      this.closeAttendanceModal()
    },
    submitOvertime() {
      console.log('Overtime until:', this.overtimeForm.overtimeUntil)
      this.closeOvertimeModal()
    },
    submitLeave() {
      console.log('Leave date:', this.leaveForm.leaveDate, 'Days:', this.leaveForm.leaveDays)
      this.closeLeaveModal()
    },
    submitSickLeave() {
      console.log(
        'Sick leave date:',
        this.sickLeaveForm.sickLeaveDate,
        'Days:',
        this.sickLeaveForm.sickLeaveDays,
      )
      // Decrease remaining leave by the number of days requested
      this.updateRemainingLeave(this.sickLeaveForm.employeeName, this.sickLeaveForm.sickLeaveDays)
      this.closeSickLeaveModal()
    },
    getRemainingLeave(employeeName) {
      const employee = this.employees.find((e) => e.name === employeeName)
      return employee ? employee.remainingLeave : 0
    },
    updateRemainingLeave(employeeName, daysTaken) {
      const employee = this.employees.find((e) => e.name === employeeName)
      if (employee) {
        employee.remainingLeave -= daysTaken
      }
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
select,
textarea {
  border-radius: 8px;
}
</style>
