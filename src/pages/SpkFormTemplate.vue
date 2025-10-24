<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
      Surat Perintah Kerja (SPK)
    </h2>

    <!-- Header -->
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold">BENGKEL MOBIL CARSPEED</h3>
      <p class="text-sm text-gray-600">
        JL. SURYOPRANOTO NO.10 - GUNUNGKETUR - PAKUALAMAN - D.I YOGYAKARTA
      </p>
      <p class="text-sm text-gray-600">Telp. 02745021953</p>
    </div>

    <!-- Work Order Number -->
    <div class="flex justify-between mb-6">
      <div class="w-1/4">
        <label for="woNumber" class="block text-sm font-medium text-gray-700">No. WO</label>
        <input
          v-model="form.woNumber"
          type="text"
          id="woNumber"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter Work Order Number"
        />
      </div>
      <div class="w-1/4">
        <label for="entryDate" class="block text-sm font-medium text-gray-700">Tgl Masuk</label>
        <input
          v-model="form.entryDate"
          type="datetime-local"
          id="entryDate"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div class="w-1/4">
        <label for="km" class="block text-sm font-medium text-gray-700">KM Masuk</label>
        <input
          v-model="form.km"
          type="number"
          id="km"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter KM"
        />
      </div>
    </div>

    <!-- Customer and Vehicle Information -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="customerName" class="block text-sm font-medium text-gray-700"
          >Nama Pemilik</label
        >
        <input
          v-model="form.customerName"
          type="text"
          id="customerName"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter customer name"
        />
      </div>
      <div>
        <label for="vehicle" class="block text-sm font-medium text-gray-700">Merk-Tipe Unit</label>
        <input
          v-model="form.vehicle"
          type="text"
          id="vehicle"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter vehicle model"
        />
      </div>
      <div>
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">No. HP</label>
        <input
          v-model="form.phoneNumber"
          type="tel"
          id="phoneNumber"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Alamat</label>
        <input
          v-model="form.address"
          type="text"
          id="address"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter address"
        />
      </div>
    </div>

    <!-- Keluhan Unit and Keterangan -->
    <div class="mb-6">
      <label for="complaint" class="block text-sm font-medium text-gray-700">Keluhan Unit</label>
      <textarea
        v-model="form.complaint"
        id="complaint"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Enter complaint"
        rows="4"
      ></textarea>
    </div>

    <div class="mb-6">
      <label for="remarks" class="block text-sm font-medium text-gray-700">Keterangan</label>
      <textarea
        v-model="form.remarks"
        id="remarks"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Enter remarks"
        rows="4"
      ></textarea>
    </div>

    <!-- Service Result and Item Details -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Hasil Pemeriksaan Mekanik</h3>
      <textarea
        v-model="form.serviceResult"
        id="serviceResult"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Enter mechanic inspection results"
        rows="4"
      ></textarea>
    </div>

    <!-- Item Jasa -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Item Jasa</h3>
      <div v-for="(item, index) in form.services" :key="index" class="mb-4">
        <div class="flex space-x-4">
          <input
            v-model="item.code"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Kode"
          />
          <input
            v-model="item.name"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Nama Item"
          />
          <input
            v-model="item.mechanic"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Mekanik"
          />
        </div>
      </div>
      <button
        @click="addService"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Service Item
      </button>
    </div>

    <!-- Item Sparepart -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Item Sparepart</h3>
      <div v-for="(sparepart, index) in form.spareparts" :key="index" class="mb-4">
        <div class="flex space-x-4">
          <input
            v-model="sparepart.code"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Kode"
          />
          <input
            v-model="sparepart.name"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Nama Sparepart"
          />
        </div>
      </div>
      <button
        @click="addSparepart"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Sparepart
      </button>
    </div>

    <!-- Footer and Signature -->
    <div class="grid grid-cols-3 gap-6 mb-6">
      <div class="text-center">
        <p>Customer:</p>
        <p class="underline">{{ form.customerName }}</p>
      </div>
      <div class="text-center">
        <p>Admin/Service Advisor:</p>
        <p class="underline">{{ form.advisor }}</p>
      </div>
      <div class="text-center">
        <p>Mekanik:</p>
        <p class="underline">{{ form.mechanic }}</p>
      </div>
    </div>

    <div class="text-center">
      <button
        @click="submitForm"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Submit Work Order
      </button>
    </div>

    <!-- Print and Download Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printForm"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print
      </button>
      <button
        @click="downloadPDF"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      form: {
        woNumber: '',
        entryDate: '',
        km: 0,
        customerName: '',
        vehicle: '',
        phoneNumber: '',
        address: '',
        complaint: '',
        remarks: '',
        serviceResult: '',
        services: [{ code: '', name: '', mechanic: '' }],
        spareparts: [{ code: '', name: '' }],
        advisor: 'Admin Name',
        mechanic: 'Mechanic Name',
      },
    }
  },
  methods: {
    addService() {
      this.form.services.push({ code: '', name: '', mechanic: '' })
    },
    addSparepart() {
      this.form.spareparts.push({ code: '', name: '' })
    },
    submitForm() {
      console.log(this.form)
    },
    printForm() {
      window.print()
    },
    downloadPDF() {
      const doc = new jsPDF()
      doc.text('Surat Perintah Kerja (SPK)', 20, 20)
      doc.text(`No. WO: ${this.form.woNumber}`, 20, 30)
      doc.text(`Nama Pemilik: ${this.form.customerName}`, 20, 40)
      doc.text(`Merk-Tipe Unit: ${this.form.vehicle}`, 20, 50)
      doc.text(`Keluhan Unit: ${this.form.complaint}`, 20, 60)
      doc.text(`Service Result: ${this.form.serviceResult}`, 20, 70)

      // Add other fields...

      doc.save('SPK.pdf')
    },
  },
}
</script>

<style scoped>
/* Custom styles here */
</style>
