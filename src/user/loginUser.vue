<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img class="w-16 h-16 rounded-full mr-2" src="../assets/images/yummy_cake.png" alt="logo" />
        <span class="font-bold text-[#ca13c5] font-Poppins">Yummy</span
        ><span class="font-semibold text-[#2b94f1] font-Roboto">Bakery</span
        ><span class="text-base font-bold font-Poppins text-[#BDB76B}">.com</span>
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <button
              type="submit"
              class="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
      <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:close="tutupToast" />
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { BASE_URL } from '../base.utils.url.ts'
import router from '../router'
import ToastCard from '../components/ToastCard.vue'

const showToast = ref(false)
const toastMessage = ref('')

async function login() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('email')
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const dataLogin = { email: email, password: password }
  const response = await axios.post(`${BASE_URL}login`, dataLogin, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.data.status == true) {
    // console.log(response.data.data.level.nama);
    const token = response.data.data.token
    const role_id = response.data.data.role_id
    const role = response.data.data.role
    const outlet_id = response.data.data.outlet_id
    const outlet_name = response.data.data.outlet_name
    const username = response.data.data.user.name
    // console.log('datanya role', role);
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('email', email)
    localStorage.setItem('username', username)
    localStorage.setItem('role_id', role_id)
    localStorage.setItem('outlet_id', outlet_id)
    localStorage.setItem('outlet_name', outlet_name)
    showToast.value = true
    toastMessage.value = response.data.message
  } else {
    showToast.value = true
    toastMessage.value = response.data.message
    console.log(response.data)
  }
}

function tutupToast() {
  showToast.value = false
  router.push('/main/dashboard')
}
</script>

<style lang="scss" scoped></style>
