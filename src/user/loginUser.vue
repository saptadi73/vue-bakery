<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-16 h-16 rounded-full mr-2"
          src="../assets/images/logo_bakery.jpg"
          alt="logo"
        />
        <span class="font-bold text-[#ca13c5] font-Poppins">Login</span>&nbsp;<span
          class="font-semibold text-[#2b94f1] font-Roboto"
          >New</span
        >&nbsp;<span class="text-base font-bold font-Poppins text-[#BDB76B}">Sun Bread</span>
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
const loginSuccess = ref(false)

function unwrapEnvelope(payload) {
  let current = payload
  let safety = 0
  while (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    'status' in current &&
    safety < 5
  ) {
    current = current.data
    safety += 1
  }
  return current
}

async function login() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('role_id')
  localStorage.removeItem('outlet_id')
  localStorage.removeItem('outlet_name')
  localStorage.removeItem('username')
  localStorage.removeItem('user_id')
  localStorage.removeItem('email')
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const dataLogin = { email: email, password: password }
  try {
    const response = await axios.post(`${BASE_URL}login`, dataLogin, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const root = response?.data
    const payload = unwrapEnvelope(root)
    const status = root?.status === true || payload?.status === true

    if (status) {
      const token = payload?.token
      const role_id = payload?.role_id ?? payload?.user?.role_id ?? ''
      const role = payload?.role ?? ''
      const outlet_id = payload?.outlet_id ?? payload?.user?.outlet_id ?? ''
      const outlet_name = payload?.outlet_name ?? ''
      const username = payload?.user?.name ?? ''
      const user_id = payload?.user?.id ?? ''

      if (!token) {
        throw new Error(root?.message || 'Token tidak ditemukan pada response login')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('email', email)
      localStorage.setItem('username', username)
      localStorage.setItem('user_id', user_id)
      localStorage.setItem('role_id', role_id)
      localStorage.setItem('outlet_id', outlet_id)
      localStorage.setItem('outlet_name', outlet_name)
      loginSuccess.value = true
      showToast.value = true
      toastMessage.value = root?.message || 'Login berhasil'
    } else {
      loginSuccess.value = false
      showToast.value = true
      toastMessage.value = root?.message || 'Salah Email dan Password'
      console.log(root)
    }
  } catch (error) {
    loginSuccess.value = false
    showToast.value = true
    toastMessage.value =
      error?.response?.data?.message || error?.message || 'Salah Email dan Password'
    console.log(error)
  }
}

function tutupToast() {
  showToast.value = false
  if (loginSuccess.value) {
    const roleId = localStorage.getItem('role_id')
    if (roleId && (roleId === '2' || roleId === '3')) {
      router.push('/produk/list')
    } else if (roleId) {
      router.push('/main/dashboard')
    }
    // If no roleId (success case), stay on login page
  }
  // If login not successful, stay on login page
}
</script>

<style lang="scss" scoped></style>
