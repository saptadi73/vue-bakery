<template>
  <div class="mt-20">
    <div class="w-[80vw] mx-auto">
      <h2 class="text-base font-roboto ipad-mini:text-2xl font-bold text-unguku text-center">
        Ini adalah Dashboard Demo Pengelolaan Usaha Perikanan melalui ERP (Enterprise Resources
        Planning) yang dikembangkan oleh PT. Gagak Rimang Teknologi.
      </h2>
      <p class="mt-5 text-sm ipad-mini:text-base text-center text-amber-700">
        ERP Perikanan sebuah sarana digital untuk memberi kemudahan pengelolaan usaha perikanan agar
        terpantau dengan baik, pengendalian anggaran, pengawasan proses produksi, dan evaluasi
        pendapatan secara akurat.
      </p>
    </div>

    <div class="mt-10 flex items-center gap-4 w-[300px] ipad-mini:w-[400px] 2xl:w-[1200px] mx-auto">
      <div class="flex-grow border-t border-5 border-gray-300"></div>
      <span
        class="font-bold text-[8pt] ipad-mini:text-[10pt] 2xl:text-[20pt] text-blue-600 font-poppins"
        >Status Kandang PT. Cakrawala Mina Industri</span
      >
      <div class="flex-grow border-t border-5 border-gray-300"></div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3 p-4">
    <kandang-card
      v-for="(kandang, index) in filteredKandangData"
      :key="index"
      :title="kandang.title"
      :labels="kandang.labels"
      :data="kandang.data"
      :colors="kandang.colors"
      :umur_ayam="kandang.umur_ayam"
      :jumlah_ayam="kandang.jumlah_ayam"
      :berat="kandang.berat"
      :mulai="kandang.mulai"
      :total_produksi="kandang.total_produksi"
      :total_biaya="kandang.total_biaya"
      :fcr="kandang.fcr"
      :progress="kandang.progress"
      :progress-color="kandang.progressColor"
      :onAction="kandang.onAction"
    />
  </div>
  <!-- Modal History -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-xl font-bold">Log History - {{ currentkandangTitle }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="overflow-y-auto p-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aktivitas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Detail
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Petugas
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(log, index) in historyLogs" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ log.activity }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ log.details }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.officer }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end p-4 border-t">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
        >
          Tutup
        </button>
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import KandangCard from '@/components/KandangCard.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const filteredKandangData = ref([])

onMounted(() => {
  const route = useRoute()
  const kandangIdFromParams = route.params.id // Ambil id dari URL

  filteredKandangData.value = dataChartku.filter(
    (kandang) => kandang.id_kandang === parseInt(kandangIdFromParams),
  )
})

const isModalOpen = ref(false)
const currentkandangTitle = ref('')
const currentkandangId = ref(null)
const historyLogs = ref([])

const dataChartku = [
  {
    id_kandang: 1,
    title: 'Kandang A010',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 30, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '35',
    jumlah_ayam: 734,
    fcr: 1.62,
    mulai: '23-02-2025',
    berat: 1.8,
    total_biaya: 1290700,
    total_produksi: 722,
    progress: 68,
    progressColor: '',
    onAction: () => openHistoryModal('A010', 'Kerapu Merah'),
  },
  {
    id_kandang: 2,
    title: 'Kandang B020',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [35, 35, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '40',
    jumlah_ayam: 850,
    fcr: 1.8,
    mulai: '15-03-2025',
    berat: 1.8,
    total_biaya: 1450000,
    total_produksi: 842,
    progress: 45,
    progressColor: 'bg-blue-500',
    onAction: () => openHistoryModal('B020', 'Udang Windu'),
  },
  {
    id_kandang: 3,
    title: 'Kandang C030',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [40, 30, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '45',
    jumlah_ayam: 920,
    fcr: 1.5,
    mulai: '01-04-2025',
    berat: 1.8,
    total_biaya: 1650000,
    total_produksi: 905,
    progress: 32,
    progressColor: '',
    onAction: () => openHistoryModal('C030', 'Bawal Bintang'),
  },
  {
    id_kandang: 4,
    title: 'Kandang A210',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 20, 35, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '44',
    jumlah_ayam: 734,
    fcr: 1.67,
    mulai: '23-02-2025',
    berat: 1.76,
    total_biaya: 1290700,
    total_produksi: 722,
    progress: 68,
    progressColor: '',
    onAction: () => openHistoryModal('A210', 'Kerapu Merah'),
  },
  {
    id_kandang: 5,
    title: 'Kandang B020',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [35, 35, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '33',
    jumlah_ayam: 850,
    fcr: 1.8,
    mulai: '15-03-2025',
    berat: 1.9,
    total_biaya: 1450000,
    total_produksi: 842,
    progress: 45,
    progressColor: 'bg-blue-500',
    onAction: () => openHistoryModal('B020', 'Kakap Merah'),
  },
  {
    id_kandang: 6,
    title: 'Kandang C030',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [40, 30, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '40',
    jumlah_ayam: 920,
    fcr: 2.1,
    mulai: '01-04-2025',
    berat: 2.0,
    total_biaya: 1650000,
    total_produksi: 905,
    progress: 32,
    progressColor: '',
    onAction: () => openHistoryModal('C030', 'Tongkol'),
  },
  {
    id_kandang: 7,
    title: 'Kandang D010',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 20, 20],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '44',
    jumlah_ayam: 734,
    fcr: 1.82,
    mulai: '23-02-2025',
    berat: 1.89,
    total_biaya: 1290700,
    total_produksi: 722,
    progress: 68,
    progressColor: '',
    onAction: () => openHistoryModal('D010', 'Lobster'),
  },
  {
    id_kandang: 8,
    title: 'Kandang B220',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [35, 45, 10, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '30',
    jumlah_ayam: 850,
    fcr: 1.8,
    mulai: '15-03-2025',
    berat: 1.87,
    total_biaya: 1450000,
    total_produksi: 842,
    progress: 45,
    progressColor: 'bg-blue-500',
    onAction: () => openHistoryModal('B220', 'Bandeng'),
  },
  {
    id_kandang: 9,
    title: 'Kandang C130',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [30, 40, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '33',
    jumlah_ayam: 820,
    fcr: 2.05,
    mulai: '01-04-2025',
    berat: 1.9,
    total_biaya: 1650000,
    total_produksi: 905,
    progress: 32,
    progressColor: '',
    onAction: () => openHistoryModal('C130', 'Bawal Bintang'),
  },
  {
    id_kandang: 10,
    title: 'Kandang T010',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 30, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '42',
    jumlah_ayam: 834,
    fcr: 1.42,
    mulai: '23-02-2025',
    berat: 1.91,
    total_biaya: 1180700,
    total_produksi: 722,
    progress: 66,
    progressColor: '',
    onAction: () => openHistoryModal('T010', 'Lobster'),
  },
  {
    id_kandang: 11,
    title: 'Kandang B420',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [40, 30, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '39',
    jumlah_ayam: 1050,
    fcr: 1.58,
    mulai: '15-03-2025',
    berat: 1.88,
    total_biaya: 1450000,
    total_produksi: 1000,
    progress: 45,
    progressColor: 'bg-blue-500',
    onAction: () => openHistoryModal('B420', 'Udang Windu'),
  },
  {
    id_kandang: 12,
    title: 'Kandang C220',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 20, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '44',
    jumlah_ayam: 920,
    fcr: 1.5,
    mulai: '01-04-2025',
    berat: 1.88,
    total_biaya: 1650000,
    total_produksi: 905,
    progress: 32,
    progressColor: '',
    onAction: () => openHistoryModal('C220', 'Kakap'),
  },
  {
    id_kandang: 13,
    title: 'Kandang F010',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 30, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '47',
    jumlah_ayam: 734,
    fcr: 1.62,
    mulai: '23-02-2025',
    berat: 1.77,
    total_biaya: 1290700,
    total_produksi: 722,
    progress: 68,
    progressColor: '',
    onAction: () => openHistoryModal('F010', 'Kerapu HItam'),
  },
  {
    id_kandang: 14,
    title: 'Kandang G020',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [35, 35, 30, 20],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '45',
    jumlah_ayam: 750,
    fcr: 1.8,
    mulai: '15-03-2025',
    berat: 1.67,
    total_biaya: 1450000,
    total_produksi: 842,
    progress: 45,
    progressColor: 'bg-blue-500',
    onAction: () => openHistoryModal('G020', 'Tongkol'),
  },
  {
    id_kandang: 15,
    title: 'Kandang H730',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [40, 20, 30, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '50',
    jumlah_ayam: 870,
    fcr: 1.59,
    mulai: '01-04-2025',
    berat: 1.89,
    total_biaya: 1650000,
    total_produksi: 905,
    progress: 32,
    progressColor: '',
    onAction: () => openHistoryModal('H730', 'Lobster'),
  },
  {
    id_kandang: 16,
    title: 'Kandang G910',
    labels: ['Benih', 'Pakan', 'Utilitas', 'Obat'],
    data: [45, 25, 10, 10],
    colors: ['#bb8fce', '#5dade2', '#2ecc71', '#f7dc6f'],
    umur_ayam: '44',
    jumlah_ayam: 1034,
    fcr: 1.72,
    mulai: '23-02-2025',
    berat: 1.9,
    total_biaya: 1290700,
    total_produksi: 1022,
    progress: 68,
    progressColor: '',
    onAction: () => openHistoryModal('G910', 'Kerapu Merah'),
  },

  // Tambahkan data lainnya sesuai kebutuhan
]

const sampleLogs = [
  {
    date: '2024-05-01 08:30',
    activity: 'Pemberian Pakan',
    details: 'Pemberian Pakan 120 kg',
    officer: 'Budi Santoso',
  },
  {
    date: '2024-05-10 14:15',
    activity: 'Pemberian Pakan',
    details: 'Memberikan pakan 10kg jenis PF1000',
    officer: 'Budi Santoso',
  },
  {
    date: '2024-05-15 09:45',
    activity: 'Pembersihan Kandang',
    details: 'Pembersihan Kandang untuk Sanitasi Ayam',
    officer: 'Ani Wijaya',
  },
  {
    date: '2024-05-20 13:20',
    activity: 'Pengobatan',
    details: 'Memberikan obat anti parasit dosis 5ml/m3',
    officer: 'Budi Santoso',
  },
  {
    date: '2024-05-25 10:00',
    activity: 'Sampling',
    details: 'Pengukuran berat sampel: rata-rata 1.87g/ekor',
    officer: 'Ani Wijaya',
  },
]

const openHistoryModal = (kandangId, kandangTitle) => {
  currentkandangId.value = kandangId
  currentkandangTitle.value = kandangTitle
  historyLogs.value = sampleLogs // Ganti dengan API call jika perlu
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const exportToExcel = () => {
  // Implementasi export to excel
  console.log('Exporting data for', currentkandangTitle.value)
  alert(`Data history ${currentkandangTitle.value} berhasil di export!`)
}
</script>

<style lang="css" scoped>
/* Optional styling untuk grid container */
.grid {
  max-width: 1800px;
  margin: 0 auto;
}
</style>
