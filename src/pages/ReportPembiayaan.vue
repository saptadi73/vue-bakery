<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header & Actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-2xl font-bold">Laporan Biaya-Biaya (UMKM Bengkel)</h1>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          @click="openModal()"
        >
          + Tambah Biaya
        </button>
        <button class="px-4 py-2 rounded-xl border hover:bg-gray-50" @click="exportCSV">
          Export CSV
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
          @click="printReport"
        >
          Cetak
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
      <div class="md:col-span-2 flex items-center gap-2">
        <label class="text-sm text-gray-600">Cari</label>
        <input
          v-model="q"
          placeholder="cari item/keterangan/PJ"
          class="flex-1 border rounded-xl px-3 py-2"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Kategori</label>
        <select v-model="filters.category" class="border rounded-xl px-3 py-2 w-full">
          <option value="all">Semua</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Akun</label>
        <select v-model="filters.account" class="border rounded-xl px-3 py-2 w-full">
          <option value="all">Semua</option>
          <option v-for="a in accounts" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Urut</label>
        <select v-model="sortDir" class="border rounded-xl px-3 py-2 w-full">
          <option value="desc">Terbaru → Terlama</option>
          <option value="asc">Terlama → Terbaru</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Dari</label>
        <input type="date" v-model="filters.from" class="border rounded-xl px-3 py-2 w-full" />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Sampai</label>
        <input type="date" v-model="filters.to" class="border rounded-xl px-3 py-2 w-full" />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Status Bayar</label>
        <select v-model="filters.payStatus" class="border rounded-xl px-3 py-2 w-full">
          <option value="all">Semua</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div class="flex items-center gap-2 justify-end text-sm text-gray-700">
        <span
          >Total Baris: <b>{{ filtered.length }}</b></span
        >
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-2xl shadow">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">No</th>
            <th class="px-4 py-3 text-left">Tanggal</th>
            <th class="px-4 py-3 text-left">Item</th>
            <th class="px-4 py-3 text-left">Kategori</th>
            <th class="px-4 py-3 text-left">Tgl Permintaan</th>
            <th class="px-4 py-3 text-left">Tgl Pembayaran</th>
            <th class="px-4 py-3 text-left">Akun Pengeluaran</th>
            <th class="px-4 py-3 text-left">Penanggung Jawab</th>
            <th class="px-4 py-3 text-right">Nominal</th>
            <th class="px-4 py-3 text-left">Keterangan</th>
            <th class="px-4 py-3 text-center w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filtered.length">
            <td colspan="11" class="px-4 py-6 text-center text-gray-500">
              Tidak ada data sesuai filter.
            </td>
          </tr>
          <tr v-for="(r, i) in filtered" :key="r.id" class="border-t">
            <td class="px-4 py-3">{{ i + 1 }}</td>
            <td class="px-4 py-3">{{ formatDate(r.date) }}</td>
            <td class="px-4 py-3">{{ r.item }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="catBadge(r.category)"
                >{{ r.category }}</span
              >
            </td>
            <td class="px-4 py-3">{{ formatDate(r.reqDate) }}</td>
            <td class="px-4 py-3">{{ formatDate(r.payDate) }}</td>
            <td class="px-4 py-3">{{ r.account }}</td>
            <td class="px-4 py-3">{{ r.pic }}</td>
            <td class="px-4 py-3 text-right font-medium">{{ formatIDR(r.amount) }}</td>
            <td class="px-4 py-3">{{ r.note }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                  @click="editRow(r)"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                  @click="deleteRow(r)"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t bg-gray-50">
            <td colspan="8" class="px-4 py-3 text-right font-semibold">Total</td>
            <td class="px-4 py-3 text-right font-bold">{{ formatIDR(totalAmount) }}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button class="text-gray-500 hover:text-black" @click="closeModal">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal</label>
            <input type="date" v-model="form.date" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Item</label>
            <input v-model="form.item" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Kategori</label>
            <select v-model="form.category" class="w-full border rounded-xl px-3 py-2">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal Permintaan</label>
            <input type="date" v-model="form.reqDate" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal Pembayaran</label>
            <input type="date" v-model="form.payDate" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Akun Pengeluaran</label>
            <select v-model="form.account" class="w-full border rounded-xl px-3 py-2">
              <option v-for="a in accounts" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Penanggung Jawab</label>
            <input v-model="form.pic" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              v-model.number="form.amount"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-xs text-gray-600 mb-1">Keterangan</label>
            <input
              v-model="form.note"
              class="w-full border rounded-xl px-3 py-2"
              placeholder="contoh: pembelian oli, pembayaran listrik, perawatan kompresor"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button class="px-4 py-2 rounded-xl border" @click="closeModal">Batal</button>
          <button class="px-4 py-2 rounded-xl bg-slate-900 text-white" @click="saveRow">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// Master data
const categories = ['operasional', 'spare part', 'pemeliharaan', 'utilitas', 'lain-lain']
const accounts = ['petty cash', 'bank']

// Filters & search
const q = ref('')
const sortDir = ref('desc')
const filters = reactive({ category: 'all', account: 'all', from: '', to: '', payStatus: 'all' })

// Sample data
const rows = reactive([
  {
    id: 1,
    date: '2025-08-18',
    item: 'Pembelian oli 20L',
    category: 'spare part',
    reqDate: '2025-08-17',
    payDate: '2025-08-18',
    account: 'bank',
    pic: 'Andi',
    amount: 1800000,
    note: 'Invoice #INV-0911',
    payStatus: 'paid',
  },
  {
    id: 2,
    date: '2025-08-19',
    item: 'Bayar listrik',
    category: 'utilitas',
    reqDate: '2025-08-19',
    payDate: '2025-08-19',
    account: 'bank',
    pic: 'Budi',
    amount: 420000,
    note: 'Tagihan PLN Juli',
    payStatus: 'paid',
  },
  {
    id: 3,
    date: '2025-08-20',
    item: 'Servis kompresor',
    category: 'pemeliharaan',
    reqDate: '2025-08-18',
    payDate: '2025-08-21',
    account: 'petty cash',
    pic: 'Citra',
    amount: 650000,
    note: 'Perawatan rutin',
    payStatus: 'pending',
  },
  {
    id: 4,
    date: '2025-08-21',
    item: 'ATK & kebersihan',
    category: 'operasional',
    reqDate: '2025-08-20',
    payDate: '2025-08-21',
    account: 'petty cash',
    pic: 'Dina',
    amount: 150000,
    note: 'Tisu, sabun',
    payStatus: 'paid',
  },
  {
    id: 5,
    date: '2025-08-21',
    item: 'Ganti selang udara',
    category: 'pemeliharaan',
    reqDate: '2025-08-20',
    payDate: '',
    account: 'bank',
    pic: 'Andi',
    amount: 230000,
    note: 'Menunggu pembayaran',
    payStatus: 'pending',
  },
])

// Search predicate
function matchQuery(r) {
  if (!q.value) return true
  const s = q.value.toLowerCase()
  return [r.item, r.note, r.pic, r.category, r.account].some((v) =>
    String(v || '')
      .toLowerCase()
      .includes(s),
  )
}

function inDateRange(r) {
  const fromOk = !filters.from || r.date >= filters.from
  const toOk = !filters.to || r.date <= filters.to
  return fromOk && toOk
}

const filtered = computed(() => {
  let data = rows.filter((r) => matchQuery(r))
  if (filters.category !== 'all') data = data.filter((r) => r.category === filters.category)
  if (filters.account !== 'all') data = data.filter((r) => r.account === filters.account)
  if (filters.payStatus !== 'all') data = data.filter((r) => r.payStatus === filters.payStatus)
  data = data.filter((r) => inDateRange(r))
  data.sort((a, b) =>
    sortDir.value === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
  )
  return data
})

const totalAmount = computed(() => filtered.value.reduce((a, b) => a + (b.amount || 0), 0))

// CRUD state
const showModal = ref(false)
const modalTitle = ref('')
const editId = ref(null)
const form = reactive({
  id: null,
  date: '',
  item: '',
  category: categories[0],
  reqDate: '',
  payDate: '',
  account: accounts[0],
  pic: '',
  amount: 0,
  note: '',
  payStatus: 'pending',
})

function openModal() {
  modalTitle.value = 'Tambah Biaya'
  editId.value = null
  Object.assign(form, {
    id: null,
    date: new Date().toISOString().slice(0, 10),
    item: '',
    category: categories[0],
    reqDate: new Date().toISOString().slice(0, 10),
    payDate: '',
    account: accounts[0],
    pic: '',
    amount: 0,
    note: '',
    payStatus: 'pending',
  })
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function saveRow() {
  if (!form.date || !form.item || !form.pic || !form.amount)
    return alert('Tanggal, item, nominal, dan penanggung jawab wajib diisi.')
  if (editId.value) {
    const idx = rows.findIndex((r) => r.id === editId.value)
    rows[idx] = { ...form, id: editId.value }
  } else {
    form.id = Date.now()
    rows.push({ ...form })
  }
  showModal.value = false
}
function editRow(r) {
  modalTitle.value = 'Edit Biaya'
  editId.value = r.id
  Object.assign(form, r)
  showModal.value = true
}
function deleteRow(r) {
  if (confirm('Hapus baris ini?')) {
    const idx = rows.findIndex((x) => x.id === r.id)
    if (idx >= 0) rows.splice(idx, 1)
  }
}

// Utils
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
function catBadge(cat) {
  switch (cat) {
    case 'operasional':
      return 'bg-sky-100 text-sky-700'
    case 'spare part':
      return 'bg-emerald-100 text-emerald-700'
    case 'pemeliharaan':
      return 'bg-amber-100 text-amber-700'
    case 'utilitas':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Export & Print
function exportCSV() {
  const header = [
    'No',
    'Tanggal',
    'Item',
    'Kategori',
    'Tgl Permintaan',
    'Tgl Pembayaran',
    'Akun Pengeluaran',
    'Penanggung Jawab',
    'Nominal',
    'Keterangan',
    'Status',
  ]
  const csvRows = filtered.value.map((r, i) => [
    i + 1,
    formatDate(r.date),
    r.item,
    r.category,
    formatDate(r.reqDate),
    formatDate(r.payDate),
    r.account,
    r.pic,
    r.amount,
    r.note,
    r.payStatus,
  ])
  const csv = [
    header.join(','),
    ...csvRows.map((r) => r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'laporan_biaya_umkm.csv'
  a.click()
  URL.revokeObjectURL(url)
}
function printReport() {
  window.print?.()
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
