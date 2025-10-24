<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h1 class="text-2xl font-bold">Buku Kas UMKM — Format Mutasi Rekening</h1>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Saldo Awal</label>
          <input
            type="number"
            v-model.number="openingBalance"
            class="border rounded-xl px-3 py-2 w-40"
          />
        </div>
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          @click="openModal('in')"
        >
          + Cash-In
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          @click="openModal('out')"
        >
          + Cash-Out
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

    <!-- Controls -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Urut</label>
        <select v-model="sortDir" class="border rounded-xl px-3 py-2">
          <option value="asc">Terlama → Terbaru</option>
          <option value="desc">Terbaru → Terlama</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Filter Jenis</label>
        <select v-model="typeFilter" class="border rounded-xl px-3 py-2">
          <option value="all">Semua</option>
          <option value="in">Cash-In</option>
          <option value="out">Cash-Out</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Dari</label>
        <input
          type="datetime-local"
          v-model="dateFrom"
          class="border rounded-xl px-3 py-2 w-full"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Sampai</label>
        <input type="datetime-local" v-model="dateTo" class="border rounded-xl px-3 py-2 w-full" />
      </div>
    </div>

    <!-- Ringkasan Atas seperti Rekening -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard title="Total Cash-In" :value="formatIDR(totalIn)" />
      <SummaryCard title="Total Cash-Out" :value="formatIDR(totalOut)" />
      <SummaryCard title="Perubahan Bersih" :value="formatIDR(netChange)" />
      <SummaryCard title="Saldo Akhir" :value="formatIDR(closingBalance)" />
    </div>

    <!-- Tabel Mutasi -->
    <div class="overflow-x-auto bg-white rounded-2xl shadow">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Tanggal & Jam</th>
            <th class="px-4 py-3 text-left">Kategori</th>
            <th class="px-4 py-3 text-right">Nominal</th>
            <th class="px-4 py-3 text-left">Penanggung Jawab</th>
            <th class="px-4 py-3 text-left">Keterangan</th>
            <th class="px-4 py-3 text-right">Saldo (Setelah Transaksi)</th>
            <th class="px-4 py-3 text-center w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Row Saldo Awal -->
          <tr class="border-t bg-gray-50">
            <td class="px-4 py-3 text-gray-600">—</td>
            <td class="px-4 py-3 text-gray-600">Saldo Awal</td>
            <td class="px-4 py-3 text-right text-gray-600">—</td>
            <td class="px-4 py-3 text-gray-600">—</td>
            <td class="px-4 py-3 text-gray-600">Saldo awal periode</td>
            <td class="px-4 py-3 text-right font-medium">{{ formatIDR(openingBalance) }}</td>
            <td class="px-4 py-3 text-center">—</td>
          </tr>

          <tr v-if="!displayRows.length">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500">
              Belum ada transaksi pada filter saat ini.
            </td>
          </tr>

          <tr v-for="r in displayRows" :key="r.id" class="border-t">
            <td class="px-4 py-3">{{ formatDateTime(r.datetime) }}</td>
            <td class="px-4 py-3">
              <span
                :class="
                  r.category === 'in'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                "
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ r.category === 'in' ? 'Cash-In' : 'Cash-Out' }}
              </span>
            </td>
            <td
              class="px-4 py-3 text-right font-medium"
              :class="r.category === 'in' ? 'text-emerald-700' : 'text-rose-700'"
            >
              {{ (r.category === 'in' ? '+' : '-') + formatIDRPlain(r.amount) }}
            </td>
            <td class="px-4 py-3">{{ r.pic }}</td>
            <td class="px-4 py-3">{{ r.note }}</td>
            <td class="px-4 py-3 text-right font-semibold">{{ formatIDR(r.balanceAfter) }}</td>
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
      </table>
    </div>

    <!-- Modal Tambah/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button class="text-gray-500 hover:text-black" @click="closeModal">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Tanggal & Jam</label>
            <input
              type="datetime-local"
              v-model="form.datetime"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Kategori</label>
            <select v-model="form.category" class="w-full border rounded-xl px-3 py-2">
              <option value="in">Cash-In</option>
              <option value="out">Cash-Out</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              v-model.number="form.amount"
              class="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Penanggung Jawab</label>
            <input v-model="form.pic" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-600 mb-1">Keterangan</label>
            <input
              v-model="form.note"
              class="w-full border rounded-xl px-3 py-2"
              placeholder="contoh: Servis motor, beli oli, setor modal"
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

// ===== Saldo Awal =====
const openingBalance = ref(3000000)

// ===== Data contoh (format rekening) =====
const rows = reactive([
  {
    id: 1,
    datetime: '2025-08-01T08:30',
    category: 'in',
    amount: 1250000,
    pic: 'Andi',
    note: 'Pendapatan servis harian',
  },
  {
    id: 2,
    datetime: '2025-08-01T12:15',
    category: 'out',
    amount: 250000,
    pic: 'Andi',
    note: 'Pembelian oli',
  },
  {
    id: 3,
    datetime: '2025-08-02T09:05',
    category: 'out',
    amount: 600000,
    pic: 'Budi',
    note: 'Gaji mekanik (harian)',
  },
  {
    id: 4,
    datetime: '2025-08-02T17:40',
    category: 'in',
    amount: 950000,
    pic: 'Citra',
    note: 'Penjualan sparepart',
  },
  {
    id: 5,
    datetime: '2025-08-03T10:10',
    category: 'out',
    amount: 180000,
    pic: 'Budi',
    note: 'Listrik & air',
  },
])

// ===== Filter & urutan =====
const sortDir = ref('asc') // asc|desc
const typeFilter = ref('all') // all|in|out
const dateFrom = ref('')
const dateTo = ref('')

// ===== Perhitungan saldo berjalan =====
const ledgerRowsAsc = computed(() => {
  // 1) sort ascending by datetime
  const asc = [...rows]
    .filter((r) => (typeFilter.value === 'all' ? true : r.category === typeFilter.value))
    .filter((r) => (dateFrom.value ? r.datetime >= dateFrom.value : true))
    .filter((r) => (dateTo.value ? r.datetime <= dateTo.value : true))
    .sort((a, b) => a.datetime.localeCompare(b.datetime))

  // 2) hitung running balance
  let balance = openingBalance.value
  return asc.map((r) => {
    const signed = r.category === 'in' ? r.amount : -r.amount
    balance += signed
    return { ...r, balanceAfter: balance }
  })
})

const displayRows = computed(() => {
  const arr = [...ledgerRowsAsc.value]
  if (sortDir.value === 'desc') arr.reverse()
  return arr
})

// ===== Ringkasan =====
const totalIn = computed(() =>
  ledgerRowsAsc.value.reduce((acc, r) => acc + (r.category === 'in' ? r.amount : 0), 0),
)
const totalOut = computed(() =>
  ledgerRowsAsc.value.reduce((acc, r) => acc + (r.category === 'out' ? r.amount : 0), 0),
)
const netChange = computed(() => totalIn.value - totalOut.value)
const closingBalance = computed(() =>
  ledgerRowsAsc.value.length
    ? ledgerRowsAsc.value[ledgerRowsAsc.value.length - 1].balanceAfter
    : openingBalance.value,
)

// ===== Modal CRUD =====
const showModal = ref(false)
const modalTitle = ref('')
const editId = ref(null)
const form = reactive({ id: null, datetime: '', category: 'in', amount: 0, pic: '', note: '' })

function openModal(type = 'in') {
  modalTitle.value = 'Tambah Transaksi'
  editId.value = null
  Object.assign(form, {
    id: null,
    datetime: new Date().toISOString().slice(0, 16),
    category: type,
    amount: 0,
    pic: '',
    note: '',
  })
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function saveRow() {
  if (!form.datetime || !form.amount || !form.pic)
    return alert('Tanggal, nominal, dan penanggung jawab wajib diisi.')
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
  modalTitle.value = 'Edit Transaksi'
  editId.value = r.id
  Object.assign(form, r)
  showModal.value = true
}
function deleteRow(r) {
  if (confirm('Hapus transaksi ini?')) {
    const idx = rows.findIndex((x) => x.id === r.id)
    if (idx >= 0) rows.splice(idx, 1)
  }
}

// ===== Util =====
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
function formatIDRPlain(n) {
  // Tanpa simbol, untuk tanda +/-
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n || 0)
}
function formatDateTime(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  if (isNaN(d)) return dt
  const date = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

// ===== Export / Print =====
function exportCSV() {
  const header = [
    'Tanggal & Jam',
    'Kategori',
    'Nominal',
    'Penanggung Jawab',
    'Keterangan',
    'Saldo Setelah',
  ]
  const data = displayRows.value.map((r) => [
    formatDateTime(r.datetime),
    r.category === 'in' ? 'Cash-In' : 'Cash-Out',
    r.category === 'in' ? `+${formatIDRPlain(r.amount)}` : `-${formatIDRPlain(r.amount)}`,
    r.pic,
    r.note,
    formatIDR(r.balanceAfter),
  ])
  const csv = [
    header.join(','),
    ...data.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'buku_kas_umkm.csv'
  a.click()
  URL.revokeObjectURL(url)
}
function printReport() {
  window.print?.()
}
</script>

<script>
export default {
  components: {
    SummaryCard: {
      props: { title: String, value: [String, Number] },
      template: `
        <div class="bg-white rounded-2xl shadow p-4">
          <div class="text-sm text-gray-500">{{ title }}</div>
          <div class="mt-1 text-xl font-semibold">{{ value }}</div>
        </div>
      `,
    },
  },
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #fafafa;
}
</style>
