<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Daftar Karyawan Bengkel</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari karyawan..."
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- List of Employees -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Employee Card -->
      <div
        v-for="(employee, index) in filteredEmployees"
        :key="index"
        class="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden hover:scale-110 hover:transition transition-transform transform duration-300"
      >
        <img :src="employee.photo" alt="Employee Photo" class="w-full h-48 object-cover" />

        <div class="p-4">
          <!-- Name -->
          <h3 class="text-lg font-semibold text-gray-800">{{ employee.name }}</h3>

          <!-- Department & Position -->
          <p class="text-sm text-gray-600">{{ employee.department }} - {{ employee.position }}</p>

          <!-- Contact Info -->
          <div class="mt-2">
            <p class="text-sm text-gray-600"><strong>Alamat:</strong> {{ employee.address }}</p>
            <p class="text-sm text-gray-600"><strong>HP:</strong> {{ employee.phone }}</p>
            <p class="text-sm text-gray-600"><strong>Email:</strong> {{ employee.email }}</p>
          </div>

          <!-- Status -->
          <div class="mt-3">
            <span
              :class="
                employee.status === 'Hadir'
                  ? 'bg-green-500'
                  : employee.status === 'Belum Hadir'
                    ? 'bg-purple-500'
                    : ''
              "
              class="inline-block px-3 py-1 text-white text-sm font-semibold rounded-full"
            >
              {{ employee.status }}
            </span>

            <!-- Absen Button -->
            <button
              v-if="employee.status === 'Belum Hadir'"
              @click="openModal(employee)"
              class="mt-2 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Absen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Attendance -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Konfirmasi Kehadiran</h3>
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Pilih Status Kehadiran</label>
          <select
            v-model="attendanceStatus"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="Tepat Waktu">Tepat Waktu</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>

        <!-- Optional Description for Late or Leave -->
        <div v-if="attendanceStatus === 'Terlambat'" class="mb-4">
          <label for="description" class="block text-sm text-gray-700">Keterangan</label>
          <textarea
            v-model="lateDescription"
            id="description"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Masukkan keterangan (opsional)"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="markAttendance"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cowok_bule from '../assets/images/cowok_bule.png'
import cowok_ganteng1 from '../assets/images/cowok_ganteng1.png'
import cowok_bengkel1 from '../assets/images/cowok_bengkel1.png'
import cowok_bengkel2 from '../assets/images/cowok_bengkel2.png'
import cewek_cantik1 from '../assets/images/cewek_cantik1.png'
import cewek_cantik2 from '../assets/images/cewek_cantik2.png'
import cewek_kasir from '../assets/images/cewek_kasir.png'

export default {
  data() {
    return {
      searchQuery: '',
      isModalOpen: false,
      attendanceStatus: 'Tepat Waktu',
      lateDescription: '',
      selectedEmployee: null,
      employees: [
        {
          name: 'Ahmad Budi',
          address: 'Jl. Raya No. 15, Jakarta',
          phone: '08123456789',
          department: 'Teknisi',
          position: 'Kepala Teknisi',
          status: 'Hadir',
          email: 'ahmad.budi@bengkel.com',
          photo: cowok_bule,
        },
        {
          name: 'Siti Aisyah',
          address: 'Jl. Merdeka No. 8, Bandung',
          phone: '08234567890',
          department: 'Admin',
          position: 'Administrasi',
          status: 'Belum Hadir',
          email: 'siti.aisyah@bengkel.com',
          photo: cewek_cantik1,
        },
        {
          name: 'Joko Santoso',
          address: 'Jl. Diponegoro No. 12, Surabaya',
          phone: '08345678901',
          department: 'Teknisi',
          position: 'Teknisi Senior',
          status: 'Hadir',
          email: 'joko.santoso@bengkel.com',
          photo: cowok_bengkel1,
        },
        {
          name: 'Maria Ulfa',
          address: 'Jl. Pahlawan No. 10, Yogyakarta',
          phone: '08567890123',
          department: 'Keuangan',
          position: 'Kasir',
          status: 'Belum Hadir',
          email: 'maria.ulfa@bengkel.com',
          photo: cewek_kasir,
        },
        {
          name: 'Gladys',
          address: 'Jl. Veteran No. 13, Yogyakarta',
          phone: '08567890453',
          department: 'Warung',
          position: 'Warung',
          status: 'Hadir',
          email: 'eyyi@bengkel.com',
          photo: cewek_cantik2,
        },
        {
          name: 'Eman Suparlan',
          address: 'Jl. Imam Bonjol 23, Jakarta Selatan',
          phone: '08567890453',
          department: 'Bengkel',
          position: 'Senior Technician',
          status: 'Belum Hadir',
          email: 'eman@bengkel.com',
          photo: cowok_bengkel2,
        },
        {
          name: 'Ronald',
          address: 'Jl. I Gusti Ngurah Rai II/A 4, Jakarta Selatan',
          phone: '08127890223',
          department: 'Bengkel',
          position: 'Senior Technician',
          status: 'Belum Hadir',
          email: 'ronald@bengkel.com',
          photo: cowok_ganteng1,
        },
      ],
    }
  },
  computed: {
    // Filtered employees based on search query
    filteredEmployees() {
      return this.employees.filter((employee) => {
        const query = this.searchQuery.toLowerCase()
        return (
          employee.name.toLowerCase().includes(query) ||
          employee.address.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query)
        )
      })
    },
  },
  methods: {
    openModal(employee) {
      this.selectedEmployee = employee
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.lateDescription = ''
      this.attendanceStatus = 'Tepat Waktu'
    },
    markAttendance() {
      if (this.selectedEmployee) {
        this.selectedEmployee.status = this.attendanceStatus
        if (this.attendanceStatus === 'Terlambat' && this.lateDescription) {
          this.selectedEmployee.description = this.lateDescription
        }
        this.closeModal()
      }
    },
  },
}
</script>

<style scoped>
/* Modal Styling */
.fixed {
  z-index: 9999;
}

textarea {
  resize: none;
}

.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-10px);
}

.card img {
  border-bottom: 1px solid #ddd;
}
</style>
