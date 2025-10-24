<template>
  <div class="p-8 space-y-8">
    <!-- Main Title Section -->
    <div class="flex justify-center items-center mb-8">
      <h1 class="text-4xl font-semibold text-gray-800 font-montserrat">Dashboard Bengkel Mobil</h1>
    </div>

    <!-- Summary Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        class="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Today</h3>
        <p class="text-3xl font-bold text-white">{{ totalWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-green-500 to-yellow-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Finished</h3>
        <p class="text-3xl font-bold text-white">{{ completedWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-red-500 to-pink-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Work Orders Pending</h3>
        <p class="text-3xl font-bold text-white">{{ pendingWorkOrders }}</p>
      </div>
      <div
        class="bg-gradient-to-r from-purple-500 to-indigo-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
      >
        <h3 class="text-lg font-semibold text-white">Employees Present</h3>
        <p class="text-3xl font-bold text-white">{{ totalEmployeesPresent }}</p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Pie Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Work Orders Status (Pie Chart)</h3>
        <div class="pie-chart-container">
          <pie-chart :data="pieChartData" />
        </div>
      </div>

      <!-- Sales Line Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Sales (Line Chart)</h3>
        <line-chart :data="salesData" />
      </div>

      <!-- Purchases Line Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Purchases (Line Chart)</h3>
        <line-chart :data="purchasesData" />
      </div>

      <!-- Purchases & Expenses vs Sales Mixed Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">
          Purchases & Expenses vs Sales (Mixed Chart)
        </h3>
        <mixed-chart :data="mixedChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import { Pie, Line, Bar } from 'vue-chartjs'
import { reactive } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
} from 'chart.js'

// Register the necessary chart elements for Bar and Line
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
)

export default {
  name: 'DashboardBengkel',
  components: {
    PieChart: Pie,
    LineChart: Line,
    MixedChart: Bar, // Mixed Bar Chart for Purchases, Expenses vs Sales
  },
  data() {
    return {
      totalWorkOrders: 120,
      completedWorkOrders: 80,
      pendingWorkOrders: 40,
      totalEmployeesPresent: 15,
      pieChartData: reactive({
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            label: 'Work Orders Status',
            data: [80, 40],
            backgroundColor: ['#36A2EB', '#FF5733'],
            hoverOffset: 4,
          },
        ],
      }),
      salesData: reactive({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [50, 75, 100, 125, 150, 175],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
          },
        ],
      }),
      purchasesData: reactive({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Purchases',
            data: [30, 50, 70, 90, 110, 130],
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            fill: true,
          },
        ],
      }),
      mixedChartData: reactive({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Data for months
        datasets: [
          {
            label: 'Purchases', // Dataset for Purchases (Bar)
            data: [30, 50, 70, 90, 110, 130], // Purchases data
            backgroundColor: 'rgba(255, 152, 0, 0.6)', // Orange for Purchases
            fill: true, // Enable filling for stacking
            stack: 'stack1', // Stack with Expenses
            type: 'bar', // Set type as 'bar' for Bar chart
          },
          {
            label: 'Expenses', // Dataset for Expenses (Bar)
            data: [20, 40, 60, 80, 100, 120], // Expenses data
            backgroundColor: 'rgba(255, 87, 51, 0.6)', // Red for Expenses
            fill: true, // Enable filling for stacking
            stack: 'stack1', // Stack with Purchases
            type: 'bar', // Set type as 'bar' for Bar chart
          },
          {
            label: 'Sales', // Dataset for Sales (Line)
            data: [100, 120, 140, 190, 220, 270], // Sales data
            borderColor: '#36A2EB', // Color for Sales (Blue)
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light Blue for Sales
            fill: false, // No fill for line chart
            tension: 0.4, // Smooth the line
            type: 'line', // Set type as 'line' for Line chart
          },
        ],
      }),
    }
  },
}
</script>

<style scoped>
/* TailwindCSS for responsive layout */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }

  .charts {
    grid-template-columns: 1fr; /* Stack charts vertically on smaller screens */
  }

  .summary {
    grid-template-columns: 1fr; /* Stack summary items vertically on smaller screens */
  }
}

.pie-chart-container {
  height: 350px; /* Set height of pie chart container */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 640px) {
  .pie-chart-container {
    height: 300px; /* Adjust for smaller screens */
  }
}

.card:hover {
  transform: scale(1.05);
}
</style>
