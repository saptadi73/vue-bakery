<template>
  <div
    class="rounded-xl shadow p-4 bg-gray-100 w-[80vw] ipad-mini:w-[40vw] 2xl:w-[20vw] mx-auto mt-10"
  >
    <h3 class="text-lg font-bold mb-4 text-center">{{ title }}</h3>
    <div class="flex justify-center items-center h-56 font-barlow">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="w-full mt-5 mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium">Progress</span>
        <span class="text-sm font-medium">{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="h-2.5 rounded-full transition-all duration-300"
          :class="progressBarColor"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
    <div class="flex justify-center items-center font-roboto">
      <div class="shadow-sm rounded-sm">
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-100 rounded-sm">
          <div class="w-36">Umur Ayam</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu">{{ umur_ayam }} hari</div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-200 rounded-sm">
          <div class="w-36">Jumlah Ayam</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu">{{ jumlah_ayam }}</div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-100 rounded-sm">
          <div class="w-36">Berat Rata-rata</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu">{{ berat }} kg</div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-200 rounded-sm">
          <div class="w-36">Mulai Produksi</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-xs text-ungumu ipad-mini:text-base">{{ mulai }}</div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-100 rounded-sm">
          <div class="w-36">Total Produksi</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu text-xs ipad-mini:text-base">
            {{ total_produksi }}
          </div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-200 rounded-sm">
          <div class="w-36">Total Biaya Keluar</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu">{{ formatRupiah(total_biaya) }}</div>
        </div>
        <div class="flex p-1 text-sm 2xl:text-base bg-blue-100 rounded-sm">
          <div class="w-36">FCR</div>
          <div class="w-10 text-center">:</div>
          <div class="font-handlee text-ungumu">{{ fcr }}</div>
        </div>
      </div>
    </div>
    <div class="mt-4 flex justify-center">
      <button
        @click="onButtonClick"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  title: {
    type: String,
    default: 'Donut Chart',
  },
  labels: {
    type: Array,
    default: () => ['Benih', 'Pakan', 'Utilitas'],
  },
  data: {
    type: Array,
    default: () => [30, 40, 30],
  },
  colors: {
    type: Array,
    default: () => ['#FF6384', '#36A2EB', '#FFCE56'],
  },
  buttonText: {
    type: String,
    default: 'Check History',
  },
  onAction: {
    type: Function,
    default: null,
  },
  umur_ayam: {
    type: String,
    default: '35',
  },
  jumlah_ayam: {
    type: Number,
    default: 0,
  },
  berat: {
    type: Number,
    default: 0,
  },
  mulai: {
    type: String,
    default: '0',
  },
  total_produksi: {
    type: Number,
    default: 1070,
  },
  total_biaya: {
    type: Number,
    default: 0,
  },
  fcr: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },
  progressColor: {
    type: String,
    default: '', // Kosongkan untuk warna dinamis
  },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}

const progressBarColor = computed(() => {
  // Jika progressColor di-set, gunakan itu
  if (props.progressColor) return props.progressColor

  // Jika tidak, tentukan warna berdasarkan progress
  if (props.progress > 70) return 'bg-green-500'
  if (props.progress > 40) return 'bg-yellow-500'
  return 'bg-red-500'
})

function onButtonClick() {
  if (props.onAction) {
    props.onAction()
  }
}

function formatRupiah(number) {
  const amount = number

  // Format as Indonesian Rupiah (IDR)
  const formattedIDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Rupiah usually doesn't show decimals
    maximumFractionDigits: 0,
  }).format(amount)

  return formattedIDR
}
</script>

<style scoped>
/* opsional styling */
</style>
