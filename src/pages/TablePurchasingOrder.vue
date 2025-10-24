<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Purchasing Orders</h1>
      <button class="px-4 py-2 rounded-2xl bg-black text-white hover:opacity-90" @click="addPO">
        Tambah PO
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-2xl shadow">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">No. PO</th>
            <th class="px-4 py-3 text-left">Nama Produk</th>
            <th class="px-4 py-3 text-left">Nama Supplier</th>
            <th class="px-4 py-3 text-left">Tanggal Pembelian</th>
            <th class="px-4 py-3 text-left">Tanggal Pengiriman</th>
            <th class="px-4 py-3 text-left">Penanggung Jawab</th>
            <th class="px-4 py-3 text-right">Harga</th>
            <th class="px-4 py-3 text-right">Pajak 11%</th>
            <th class="px-4 py-3 text-right">Total Harga</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-center w-48">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="po in pos" :key="po.no" class="border-t">
            <td class="px-4 py-3 font-medium">{{ po.no }}</td>
            <td class="px-4 py-3">{{ po.namaProduk }}</td>
            <td class="px-4 py-3">{{ po.namaSupplier }}</td>
            <td class="px-4 py-3">{{ formatDate(po.tanggalPembelian) }}</td>
            <td class="px-4 py-3">{{ formatDate(po.tanggalPengiriman) }}</td>
            <td class="px-4 py-3">{{ po.penanggungJawab }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(po.harga) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(tax11(po.harga)) }}</td>
            <td class="px-4 py-3 text-right font-semibold">
              {{ formatIDR(totalWithTax(po.harga)) }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="statusClass(po.status)"
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ po.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  v-if="po.status === 'open'"
                  @click="editPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  v-if="po.status === 'paid'"
                  @click="cetakPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-slate-800 text-white hover:opacity-90"
                >
                  Cetak
                </button>
                <button
                  v-if="po.status === 'billed'"
                  @click="bayarPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Bayar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Edit Sederhana -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Edit PO — {{ form.no }}</h2>
          <button class="text-gray-500 hover:text-black" @click="closeModal">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Nama Produk</label>
            <input v-model="form.namaProduk" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Nama Supplier</label>
            <input v-model="form.namaSupplier" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal Pembelian</label>
            <input
              type="date"
              v-model="form.tanggalPembelian"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal Pengiriman</label>
            <input
              type="date"
              v-model="form.tanggalPengiriman"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Penanggung Jawab</label>
            <input v-model="form.penanggungJawab" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Harga (Rp)</label>
            <input
              type="number"
              v-model.number="form.harga"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Status</label>
            <select v-model="form.status" class="w-full border rounded-xl px-3 py-2">
              <option value="open">open</option>
              <option value="paid">paid</option>
              <option value="billed">billed</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button class="px-4 py-2 rounded-xl border" @click="closeModal">Batal</button>
          <button class="px-4 py-2 rounded-xl bg-black text-white" @click="savePO">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const pos = reactive([
  {
    no: 'PO-001',
    namaProduk: 'Laptop Lenovo',
    namaSupplier: 'PT. Sumber Jaya',
    tanggalPembelian: '2025-08-21',
    tanggalPengiriman: '2025-08-28',
    penanggungJawab: 'Andi',
    harga: 10000000,
    status: 'open',
  },
  {
    no: 'PO-002',
    namaProduk: 'Printer Epson',
    namaSupplier: 'CV. Mega Print',
    tanggalPembelian: '2025-08-19',
    tanggalPengiriman: '2025-08-25',
    penanggungJawab: 'Budi',
    harga: 3000000,
    status: 'paid',
  },
  {
    no: 'PO-003',
    namaProduk: 'Meja Kantor',
    namaSupplier: 'PT. Furni Indo',
    tanggalPembelian: '2025-08-15',
    tanggalPengiriman: '2025-08-23',
    penanggungJawab: 'Citra',
    harga: 5000000,
    status: 'billed',
  },
])

const showModal = ref(false)
const editingIndex = ref(-1)
const form = reactive({
  no: '',
  namaProduk: '',
  namaSupplier: '',
  tanggalPembelian: '',
  tanggalPengiriman: '',
  penanggungJawab: '',
  harga: 0,
  status: 'open',
})

function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function tax11(harga) {
  return Math.round((harga || 0) * 0.11)
}
function totalWithTax(harga) {
  return (harga || 0) + tax11(harga)
}
function statusClass(status) {
  switch (status) {
    case 'open':
      return 'bg-amber-100 text-amber-700'
    case 'paid':
      return 'bg-emerald-100 text-emerald-700'
    case 'billed':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function editPO(po) {
  editingIndex.value = pos.findIndex((p) => p.no === po.no)
  Object.assign(form, po)
  showModal.value = true
}
function cetakPO(po) {
  // Placeholder: implementasikan cetak (print) sesuai kebutuhan sistem Anda
  window.print?.()
  alert(`Mencetak PO ${po.no}`)
}
function bayarPO(po) {
  // Placeholder: arahkan ke flow pembayaran atau ubah status
  if (confirm(`Lanjut bayar PO ${po.no}?`)) {
    po.status = 'paid'
    alert('Pembayaran berhasil. Status diubah ke paid.')
  }
}
function closeModal() {
  showModal.value = false
}
function savePO() {
  if (editingIndex.value >= 0) {
    Object.assign(pos[editingIndex.value], { ...form })
  }
  showModal.value = false
}
function addPO() {
  const seq = pos.length + 1
  const newPO = {
    no: `PO-${String(seq).padStart(3, '0')}`,
    namaProduk: 'Produk Baru',
    namaSupplier: 'Supplier Baru',
    tanggalPembelian: new Date().toISOString().slice(0, 10),
    tanggalPengiriman: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    penanggungJawab: 'PJ',
    harga: 0,
    status: 'open',
  }
  pos.push(newPO)
}
</script>

<!-- Tailwind relies on your project setup. Ensure Tailwind is configured in your Vue build. -->

<style scoped>
/**** Optional: tweak table row hover ****/
tbody tr:hover {
  background-color: #fafafa;
}
</style>
