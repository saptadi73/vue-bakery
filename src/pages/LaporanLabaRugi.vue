<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-2xl font-bold">Laporan Laba Rugi (UMKM Bengkel)</h1>
      <div class="flex flex-wrap items-center gap-2">
        <input type="month" v-model="filters.period" class="border rounded-xl px-3 py-2" />
        <button
          class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
          @click="exportCSV"
        >
          Export CSV
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          @click="printReport"
        >
          Cetak
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          @click="openModal('revenue')"
        >
          + Pendapatan
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          @click="openModal('expense')"
        >
          + Biaya
        </button>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <SummaryCard title="Pendapatan" :value="formatIDR(totalRevenue)" />
      <SummaryCard title="HPP (COGS)" :value="formatIDR(totalCOGS)" />
      <SummaryCard title="Laba Kotor" :value="formatIDR(grossProfit)" />
      <SummaryCard title="Beban Operasional" :value="formatIDR(totalOpex)" />
      <SummaryCard title="Laba Bersih" :value="formatIDR(netProfit)" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard title="Gross Margin" :value="formatPct(grossMargin)" />
      <SummaryCard title="Operating Margin" :value="formatPct(operatingMargin)" />
      <SummaryCard title="Net Margin" :value="formatPct(netMargin)" />
    </div>

    <!-- Pendapatan -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">Pendapatan</h2>
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Deskripsi</th>
              <th class="px-4 py-3 text-right">Nominal</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!revenueRowsFiltered.length">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                Belum ada data pendapatan.
              </td>
            </tr>
            <tr v-for="r in revenueRowsFiltered" :key="r.id" class="border-t">
              <td class="px-4 py-3">{{ formatDate(r.date) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="revBadge(r.category)"
                  >{{ r.category }}</span
                >
              </td>
              <td class="px-4 py-3">{{ r.desc }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatIDR(r.amount) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    @click="editRow(r, 'revenue')"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                    @click="deleteRow(r, 'revenue')"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t bg-gray-50">
              <td colspan="3" class="px-4 py-3 text-right font-semibold">Total Pendapatan</td>
              <td class="px-4 py-3 text-right font-bold">{{ formatIDR(totalRevenue) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <!-- HPP / COGS -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">Harga Pokok Penjualan (HPP / COGS)</h2>
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Deskripsi</th>
              <th class="px-4 py-3 text-right">Nominal</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!cogsRowsFiltered.length">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">Belum ada data HPP.</td>
            </tr>
            <tr v-for="r in cogsRowsFiltered" :key="r.id" class="border-t">
              <td class="px-4 py-3">{{ formatDate(r.date) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
                  >{{ r.category }}</span
                >
              </td>
              <td class="px-4 py-3">{{ r.desc }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatIDR(r.amount) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    @click="editRow(r, 'cogs')"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                    @click="deleteRow(r, 'cogs')"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t bg-gray-50">
              <td colspan="3" class="px-4 py-3 text-right font-semibold">Total HPP</td>
              <td class="px-4 py-3 text-right font-bold">{{ formatIDR(totalCOGS) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <!-- Beban Operasional -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">Beban Operasional</h2>
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Deskripsi</th>
              <th class="px-4 py-3 text-right">Nominal</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!opexRowsFiltered.length">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">Belum ada data beban.</td>
            </tr>
            <tr v-for="r in opexRowsFiltered" :key="r.id" class="border-t">
              <td class="px-4 py-3">{{ formatDate(r.date) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="expBadge(r.category)"
                  >{{ r.category }}</span
                >
              </td>
              <td class="px-4 py-3">{{ r.desc }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatIDR(r.amount) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    @click="editRow(r, 'expense')"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                    @click="deleteRow(r, 'expense')"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t bg-gray-50">
              <td colspan="3" class="px-4 py-3 text-right font-semibold">
                Total Beban Operasional
              </td>
              <td class="px-4 py-3 text-right font-bold">{{ formatIDR(totalOpex) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <!-- Ringkasan Bawah (hasil) -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-2xl shadow p-4">
        <h3 class="font-semibold mb-2">Rekap</h3>
        <dl class="space-y-1 text-sm">
          <div class="flex justify-between">
            <dt>Pendapatan</dt>
            <dd class="font-medium">{{ formatIDR(totalRevenue) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>HPP</dt>
            <dd class="font-medium">{{ formatIDR(totalCOGS) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Laba Kotor</dt>
            <dd class="font-semibold">{{ formatIDR(grossProfit) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Beban Operasional</dt>
            <dd class="font-medium">{{ formatIDR(totalOpex) }}</dd>
          </div>
          <div class="flex justify-between border-t pt-2">
            <dt>Laba Bersih</dt>
            <dd class="font-bold text-emerald-700">{{ formatIDR(netProfit) }}</dd>
          </div>
        </dl>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <h3 class="font-semibold mb-2">Komposisi Pendapatan</h3>
        <ul class="text-sm space-y-1">
          <li v-for="k in revenueCategories" :key="k" class="flex justify-between">
            <span>{{ k }}</span
            ><span class="font-medium">{{ formatIDR(sumByCategory(revenueRowsFiltered, k)) }}</span>
          </li>
        </ul>
      </div>
    </section>

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
            <label class="block text-xs text-gray-600 mb-1">Tanggal</label>
            <input type="date" v-model="form.date" class="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Jenis</label>
            <select v-model="form.kind" class="w-full border rounded-xl px-3 py-2">
              <option value="revenue">Pendapatan</option>
              <option value="cogs">HPP (COGS)</option>
              <option value="expense">Beban Operasional</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-600 mb-1">Kategori</label>
            <select v-model="form.category" class="w-full border rounded-xl px-3 py-2">
              <optgroup label="Pendapatan">
                <option v-for="c in revenueCategories" :key="c" :value="c">{{ c }}</option>
              </optgroup>
              <optgroup label="HPP">
                <option v-for="c in cogsCategories" :key="c" :value="c">{{ c }}</option>
              </optgroup>
              <optgroup label="Beban Operasional">
                <option v-for="c in expenseCategories" :key="c" :value="c">{{ c }}</option>
              </optgroup>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-600 mb-1">Deskripsi</label>
            <input
              v-model="form.desc"
              class="w-full border rounded-xl px-3 py-2"
              placeholder="contoh: Servis ringan, pembelian sparepart, bayar listrik"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              v-model.number="form.amount"
              class="w-full border rounded-xl px-3 py-2"
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

// ===== Filters =====
const filters = reactive({ period: new Date().toISOString().slice(0, 7) })
const currentPeriod = computed(() => filters.period)

const isInPeriod = (d) => (d || '').startsWith(currentPeriod.value)

// ===== Categories =====
const revenueCategories = ['Penjualan Spare Part', 'Jasa Bengkel', 'Warung/Cafe']
const cogsCategories = ['Pembelian Spare Part (COGS)']
const expenseCategories = [
  'Utilitas - Internet',
  'Utilitas - Air',
  'Utilitas - Listrik',
  'Gaji',
  'Lembur',
  'Transportasi',
  'Komunikasi',
  'Pembelian Bahan - BBM',
  'Pembelian Bahan - Oli',
  'ATK',
  'Lain-lain',
]

// ===== Sample Data =====
const revenueRows = reactive([
  {
    id: 1,
    date: '2025-08-01',
    category: 'Jasa Bengkel',
    desc: 'Servis ringan & tune up',
    amount: 3500000,
  },
  {
    id: 2,
    date: '2025-08-02',
    category: 'Penjualan Spare Part',
    desc: 'Oli & kampas rem',
    amount: 2100000,
  },
  { id: 3, date: '2025-08-03', category: 'Warung/Cafe', desc: 'Kopi & mie instan', amount: 450000 },
])

const cogsRows = reactive([
  {
    id: 4,
    date: '2025-08-02',
    category: 'Pembelian Spare Part (COGS)',
    desc: 'Oli, kampas rem',
    amount: 1200000,
  },
])

const expenseRows = reactive([
  { id: 5, date: '2025-08-03', category: 'Gaji', desc: 'Gaji mekanik mingguan', amount: 1800000 },
  {
    id: 6,
    date: '2025-08-05',
    category: 'Utilitas - Listrik',
    desc: 'Tagihan listrik',
    amount: 350000,
  },
  { id: 7, date: '2025-08-05', category: 'Transportasi', desc: 'Ongkir sparepart', amount: 100000 },
  {
    id: 8,
    date: '2025-08-06',
    category: 'Pembelian Bahan - Oli',
    desc: 'Top up oli umum',
    amount: 300000,
  },
  { id: 9, date: '2025-08-06', category: 'ATK', desc: 'Buku nota & pena', amount: 80000 },
])

// ===== Computed (filters) =====
const revenueRowsFiltered = computed(() => revenueRows.filter((r) => isInPeriod(r.date)))
const cogsRowsFiltered = computed(() => cogsRows.filter((r) => isInPeriod(r.date)))
const opexRowsFiltered = computed(() => expenseRows.filter((r) => isInPeriod(r.date)))

// ===== Summaries =====
const sum = (arr) => arr.reduce((a, b) => a + (b.amount || 0), 0)
const totalRevenue = computed(() => sum(revenueRowsFiltered.value))
const totalCOGS = computed(() => sum(cogsRowsFiltered.value))
const grossProfit = computed(() => totalRevenue.value - totalCOGS.value)
const totalOpex = computed(() => sum(opexRowsFiltered.value))
const netProfit = computed(() => grossProfit.value - totalOpex.value)

const grossMargin = computed(() =>
  totalRevenue.value ? grossProfit.value / totalRevenue.value : 0,
)
const operatingMargin = computed(() =>
  totalRevenue.value ? (grossProfit.value - totalOpex.value) / totalRevenue.value : 0,
)
const netMargin = computed(() => (totalRevenue.value ? netProfit.value / totalRevenue.value : 0))

function sumByCategory(rows, cat) {
  return rows.filter((r) => r.category === cat).reduce((a, b) => a + b.amount, 0)
}

// ===== Modal CRUD =====
const showModal = ref(false)
const modalTitle = ref('')
const editContext = ref({ id: null, table: 'revenue' })
const form = reactive({
  id: null,
  date: '',
  kind: 'revenue',
  category: revenueCategories[0],
  desc: '',
  amount: 0,
})

function openModal(kind = 'revenue') {
  modalTitle.value = 'Tambah Baris'
  editContext.value = { id: null, table: kind }
  Object.assign(form, {
    id: null,
    date: new Date().toISOString().slice(0, 10),
    kind,
    category: categoryDefault(kind),
    desc: '',
    amount: 0,
  })
  showModal.value = true
}
function categoryDefault(kind) {
  if (kind === 'revenue') return revenueCategories[0]
  if (kind === 'cogs') return cogsCategories[0]
  return expenseCategories[0]
}
function closeModal() {
  showModal.value = false
}
function saveRow() {
  if (!form.date || !form.category || !form.amount)
    return alert('Tanggal, kategori, dan nominal wajib diisi.')
  const target =
    form.kind === 'revenue' ? revenueRows : form.kind === 'cogs' ? cogsRows : expenseRows
  if (form.id) {
    const idx = target.findIndex((r) => r.id === form.id)
    target[idx] = {
      id: form.id,
      date: form.date,
      category: form.category,
      desc: form.desc,
      amount: form.amount,
    }
  } else {
    const id = Date.now()
    target.push({
      id,
      date: form.date,
      category: form.category,
      desc: form.desc,
      amount: form.amount,
    })
  }
  showModal.value = false
}
function editRow(r, table) {
  modalTitle.value = 'Edit Baris'
  form.id = r.id
  form.date = r.date
  form.desc = r.desc
  form.amount = r.amount
  if (table === 'revenue') {
    form.kind = 'revenue'
    form.category = r.category
  } else if (table === 'cogs') {
    form.kind = 'cogs'
    form.category = r.category
  } else {
    form.kind = 'expense'
    form.category = r.category
  }
  showModal.value = true
}
function deleteRow(r, table) {
  if (!confirm('Hapus baris ini?')) return
  const target = table === 'revenue' ? revenueRows : table === 'cogs' ? cogsRows : expenseRows
  const idx = target.findIndex((x) => x.id === r.id)
  if (idx >= 0) target.splice(idx, 1)
}

// ===== Utils =====
function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
function formatPct(x) {
  return new Intl.NumberFormat('id-ID', { style: 'percent', maximumFractionDigits: 1 }).format(
    x || 0,
  )
}
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function revBadge(cat) {
  switch (cat) {
    case 'Penjualan Spare Part':
      return 'bg-emerald-100 text-emerald-700'
    case 'Jasa Bengkel':
      return 'bg-sky-100 text-sky-700'
    case 'Warung/Cafe':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
function expBadge(cat) {
  if (cat.startsWith('Utilitas')) return 'bg-indigo-100 text-indigo-700'
  switch (cat) {
    case 'Gaji':
      return 'bg-rose-100 text-rose-700'
    case 'Lembur':
      return 'bg-rose-100 text-rose-700'
    case 'Transportasi':
      return 'bg-amber-100 text-amber-700'
    case 'Komunikasi':
      return 'bg-sky-100 text-sky-700'
    case 'Pembelian Bahan - BBM':
      return 'bg-emerald-100 text-emerald-700'
    case 'Pembelian Bahan - Oli':
      return 'bg-emerald-100 text-emerald-700'
    case 'ATK':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// ===== Export / Print =====
function exportCSV() {
  const header = ['Jenis', 'Tanggal', 'Kategori', 'Deskripsi', 'Nominal']
  const rows = [
    ...revenueRowsFiltered.value.map((r) => ['Pendapatan', r.date, r.category, r.desc, r.amount]),
    ...cogsRowsFiltered.value.map((r) => ['HPP', r.date, r.category, r.desc, r.amount]),
    ...opexRowsFiltered.value.map((r) => ['Beban', r.date, r.category, r.desc, r.amount]),
  ]
  const csv = [
    header.join(','),
    ...rows.map((r) => r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laba_rugi_${currentPeriod.value}.csv`
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
