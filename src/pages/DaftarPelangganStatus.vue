<template>
  <div class="p-6 space-y-6">
    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">Tabel Pelanggan</h3>
      <!-- Table -->
      <table class="min-w-full table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Nama</th>
            <th class="px-4 py-2 text-left">Alamat</th>
            <th class="px-4 py-2 text-left">No. HP</th>
            <th class="px-4 py-2 text-left">Jenis Mobil</th>
            <th class="px-4 py-2 text-left">Brand</th>
            <th class="px-4 py-2 text-left">Type</th>
            <th class="px-4 py-2 text-left">Nomor Polisi</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Masuk</th>
            <th class="px-4 py-2 text-left">Ditangani</th>
            <th class="px-4 py-2 text-left">Perkiraan Selesai</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customers" :key="index">
            <td class="px-4 py-2 border-b">{{ customer.name }}</td>
            <td class="px-4 py-2 border-b">{{ customer.address }}</td>
            <td class="px-4 py-2 border-b">{{ customer.phone }}</td>
            <td class="px-4 py-2 border-b">{{ customer.carType }}</td>
            <td class="px-4 py-2 border-b">{{ customer.brand }}</td>
            <td class="px-4 py-2 border-b">{{ customer.model }}</td>
            <td class="px-4 py-2 border-b">{{ customer.licensePlate }}</td>
            <td class="px-4 py-2 border-b">{{ customer.status }}</td>
            <td class="px-4 py-2 border-b">{{ customer.entryDate }}</td>
            <td class="px-4 py-2 border-b">{{ customer.employee }}</td>
            <td class="px-4 py-2 border-b">{{ customer.estimatedCompletion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerTable',
  data() {
    return {
      customers: [
        {
          name: 'John Doe',
          address: 'Jl. Merdeka No. 123, Jakarta',
          phone: '08123456789',
          carType: 'Sedan',
          brand: 'Toyota',
          model: 'Avanza',
          licensePlate: 'B 1234 XYZ',
          status: 'Progress',
          entryDate: '2025-08-20 10:30',
          employee: 'Jane Smith',
          estimatedCompletion: '2025-08-21 14:00',
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
          entryDate: '2025-08-19 09:00',
          employee: 'John Doe',
          estimatedCompletion: '2025-08-19 16:00',
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
          entryDate: '2025-08-18 14:00',
          employee: 'David Brown',
          estimatedCompletion: '2025-08-22 12:00',
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
          entryDate: '2025-08-17 08:30',
          employee: 'Maria Anderson',
          estimatedCompletion: '2025-08-17 15:00',
        },
        {
          name: 'Budi Setiawan',
          address: 'Jl. Sinar No. 78, Medan',
          phone: '08776543210',
          carType: 'Coupe',
          brand: 'BMW',
          model: 'M4',
          licensePlate: 'E 1023 JKL',
          status: 'Progress',
          entryDate: '2025-08-16 11:00',
          employee: 'Sarah Connor',
          estimatedCompletion: '2025-08-18 18:00',
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
          entryDate: '2025-08-14 16:00',
          employee: 'Michael Douglas',
          estimatedCompletion: '2025-08-15 13:00',
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
          entryDate: '2025-08-13 13:30',
          employee: 'Angela Lee',
          estimatedCompletion: '2025-08-20 10:00',
        },
        {
          name: 'Fajar Nugroho',
          address: 'Jl. Kartini No. 54, Jakarta',
          phone: '08567890123',
          carType: 'Wagon',
          brand: 'Kia',
          model: 'Sorrento',
          licensePlate: 'H 6789 STU',
          status: 'Selesai',
          entryDate: '2025-08-12 09:00',
          employee: 'William Smith',
          estimatedCompletion: '2025-08-12 17:00',
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
          entryDate: '2025-08-11 14:30',
          employee: 'Linda Miller',
          estimatedCompletion: '2025-08-15 16:00',
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
          entryDate: '2025-08-10 10:00',
          employee: 'Jessica Parker',
          estimatedCompletion: '2025-08-10 14:00',
        },
      ],
    };
  },
};
</script>

<style scoped>
/* TailwindCSS for responsive layout */
@media (max-width: 768px) {
  table {
    width: 100%;
    overflow-x: auto;
    display: block;
  }

  th, td {
    padding: 8px;
    text-align: left;
    font-size: 12px;
  }

  th {
    background-color: #f3f4f6;
  }
}
</style>
