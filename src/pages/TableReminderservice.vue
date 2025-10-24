<template>
  <div class="container mx-auto p-4">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center font-lexend">
      Service Reminder
    </h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pelanggan..."
        class="px-4 py-2 border rounded-md w-full"
      />
    </div>

    <!-- Table -->
    <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 text-left">Nama Pelanggan</th>
          <th class="px-4 py-2 text-left">No. Polisi</th>
          <th class="px-4 py-2 text-left">Tipe</th>
          <th class="px-4 py-2 text-left">Jenis Brand</th>
          <th class="px-4 py-2 text-left">No. HP</th>
          <th class="px-4 py-2 text-left">Last Service</th>
          <th class="px-4 py-2 text-left">Next Service</th>
          <th class="px-4 py-2 text-left">Pengingat Otomatis</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in filteredCustomers" :key="customer.id">
          <td class="px-4 py-2">{{ customer.name }}</td>
          <td class="px-4 py-2">{{ customer.licensePlate }}</td>
          <td class="px-4 py-2">{{ customer.type }}</td>
          <td class="px-4 py-2">{{ customer.brand }}</td>
          <td class="px-4 py-2">{{ customer.phone }}</td>
          <td class="px-4 py-2">{{ customer.lastService }}</td>
          <td class="px-4 py-2">{{ customer.nextService }}</td>
          <td class="px-4 py-2">
            <!-- Toggle Switch -->
            <label
              :for="'toggleReminder-' + customer.id"
              class="inline-flex relative items-center cursor-pointer"
            >
              <input
                :id="'toggleReminder-' + customer.id"
                type="checkbox"
                v-model="customer.autoReminder"
                class="sr-only"
                @click="toggleReminder(customer)"
              />
              <span
                class="w-11 h-6 bg-gray-200 rounded-full"
                :class="customer.autoReminder ? 'bg-green-500' : 'bg-gray-300'"
              ></span>
              <span
                class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all ease-in-out duration-300"
                :class="customer.autoReminder ? 'transform translate-x-5' : ''"
              ></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      customers: [
        {
          id: 1,
          name: 'John Doe',
          licensePlate: 'B123XYZ',
          type: 'Sedan',
          brand: 'Toyota',
          phone: '081234567890',
          lastService: '2025-08-01',
          nextService: '2025-09-01',
          autoReminder: false,
        },
        {
          id: 2,
          name: 'Jane Smith',
          licensePlate: 'B456ABC',
          type: 'SUV',
          brand: 'Honda',
          phone: '081298765432',
          lastService: '2025-07-15',
          nextService: '2025-08-15',
          autoReminder: true,
        },
        {
          id: 3,
          name: 'Mike Johnson',
          licensePlate: 'B789DEF',
          type: 'Coupe',
          brand: 'BMW',
          phone: '081234598761',
          lastService: '2025-06-20',
          nextService: '2025-07-20',
          autoReminder: false,
        },
        // More customers
      ],
    }
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.licensePlate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.phone.includes(this.searchQuery),
      )
    },
  },
  methods: {
    toggleReminder(customer) {
      customer.autoReminder = !customer.autoReminder
    },
  },
}
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
