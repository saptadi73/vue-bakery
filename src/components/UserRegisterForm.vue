<template>
  <div class="register-container">
    <form class="register-form" @submit.prevent="submitRegister">
      <h2>Registrasi User</h2>
      <div class="form-group">
        <label>Nama</label>
        <input v-model="form.name" type="text" required placeholder="Nama lengkap" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required placeholder="Email" />
      </div>
      <div class="form-group password-group">
        <label>Password</label>
        <div class="password-input-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            placeholder="Password"
          />
          <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
            <span v-if="showPassword">🙈</span>
            <span v-else>👁️</span>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Role</label>
        <select v-model="form.role_id" required>
          <option value="" disabled>Pilih Role</option>
          <option v-for="value in roles" :key="value.id" :value="value.id">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Outlet</label>
        <select v-model="form.outlet_id" required>
          <option value="" disabled>Pilih Outlet</option>
          <option v-for="value in outlets" :key="value.id" :value="value.id">
            {{ value.nama }}
          </option>
        </select>
      </div>
      <button type="submit" class="register-btn" @click="registerUser">Daftar</button>
      <div v-if="registerStatus" class="register-status">{{ registerStatus }}</div>
    </form>
    <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:close="tutupToast" />
    <loading-overlay />
  </div>
</template>

<script>
import api from '@/user/axios'
import LoadingOverlay from './LoadingOverlay.vue'
import ToastCard from './ToastCard.vue'
import { useLoadingStore } from '@/stores/loading'

export default {
  name: 'UserRegisterForm',
  components: { LoadingOverlay, ToastCard },
  data() {
    return {
      toastMessage: '',
      showToast: false,
      form: {
        name: '',
        email: '',
        password: '',
        role_id: '',
        outlet_id: '',
      },
      showPassword: false,
      registerStatus: '',
      outlets: '',
      roles: '',
    }
  },
  methods: {
    submitRegister() {
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.password ||
        !this.form.role_id ||
        !this.form.outlet_id
      ) {
        this.registerStatus = 'Semua field wajib diisi.'
        return
      }
      // Simulasi submit, ganti dengan request ke backend jika perlu
      this.registerStatus = 'Registrasi berhasil!'
      setTimeout(() => {
        this.registerStatus = ''
        this.form = { name: '', email: '', password: '', role_id: '', outlet_id: '' }
        this.showPassword = false
      }, 1500)
    },
    async getOutets() {
      try {
        const response = await api.get('/outlets/all')
        this.outlets = response.data.data
        console.log(this.outlets)
      } catch (error) {
        console.error('Error fetching outlets:', error)
      }
    },
    async registerUser() {
      try {
        const response = await api.post('/register', this.form)
        this.registerStatus = 'Registrasi berhasil!'
        this.form = { name: '', email: '', password: '', role_id: '', outlet_id: '' }
        this.showPassword = false
        this.showToast = true
        this.toastMessage = response.data.message
        console.log('Registration response:', response.data)
      } catch (error) {
        this.registerStatus = 'Registrasi gagal. Silakan coba lagi.'
        console.error('Registration error:', error)
      }
    },
    tutupToast() {
      this.showToast = false
      window.location.reload()
    },
    async getRoles() {
      try {
        const response = await api.get('/roles')
        this.roles = response.data.data
        console.log('Data Role: ', this.roles)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    },
  },
  created() {
    this.getOutets()
    this.getRoles()
  },
  setup() {
    const loadingStore = useLoadingStore()
    return { loadingStore }
  },
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
}
.register-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 28px 24px 28px;
  min-width: 320px;
  max-width: 95vw;
}
.register-form h2 {
  margin-bottom: 18px;
  font-size: 1.3em;
  font-weight: 700;
  text-align: center;
}
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: 1em;
  font-weight: 500;
}
.password-group {
  position: relative;
}
.password-input-wrapper {
  display: flex;
  align-items: center;
}
.password-input-wrapper input {
  flex: 1;
}
.toggle-btn {
  background: none;
  border: none;
  margin-left: 8px;
  font-size: 1.2em;
  cursor: pointer;
  padding: 2px 6px;
}
.register-btn {
  width: 100%;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.register-btn:hover {
  background: #2e7031;
}
.register-status {
  margin-top: 12px;
  color: #e65100;
  text-align: center;
  font-size: 1em;
}
</style>
