<template>
  <div class="users-table-container">
    <div class="top-bar">
      <h2>Daftar Users</h2>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Cari user..." class="search-input" />
    </div>
    <!-- Tabel untuk desktop -->
    <table class="users-table" v-if="!isMobile">
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="openDeleteModal(user)" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Card untuk mobile -->
    <div class="user-card-list" v-if="isMobile">
      <div v-for="(user, index) in filteredUsers" :key="user.id" class="user-card">
        <div class="user-info">
          <div class="user-no">{{ index + 1 }}</div>
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
          <div class="user-actions">
            <button @click="openDeleteModal(user)" class="delete-btn-mobile">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <ToastCard v-if="showToast" :message="message_toast" @close="showToast = false" />
    <LoadingOverlay v-if="isLoading" />
    <DeleteUserModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :userId="userToDelete?.id"
      :userName="userToDelete?.name"
      @close="closeDeleteModal"
      @deleted="onUserDeleted"
    />
  </div>
</template>

<script>
import api from '@/user/axios.js'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import DeleteUserModal from '../components/DeleteUserModal.vue'

export default {
  name: 'TableUsers',
  components: { ToastCard, LoadingOverlay, DeleteUserModal },
  data() {
    return {
      users: [],
      searchQuery: '',
      isMobile: false,
      showToast: false,
      message_toast: '',
      isLoading: false,
      showDeleteModal: false,
      userToDelete: null,
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users
      const q = this.searchQuery.toLowerCase()
      return this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.id.toString().includes(q),
      )
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchUsers()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    async fetchUsers() {
      this.isLoading = true
      try {
        const response = await api.get(`${BASE_URL}users`)
        if (response.data.status) {
          this.users = response.data.data
        } else {
          this.message_toast = 'Gagal mengambil data users'
          this.showToast = true
        }
        console.log('Fetched users:', this.users)
      } catch (error) {
        console.error('Error fetching users:', error)
        this.message_toast = 'Terjadi kesalahan saat mengambil data users'
        this.showToast = true
      } finally {
        this.isLoading = false
      }
    },
    openDeleteModal(user) {
      this.userToDelete = user
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.userToDelete = null
    },
    onUserDeleted() {
      this.fetchUsers()
      this.message_toast = 'User berhasil dihapus'
      this.showToast = true
    },
  },
}
</script>

<style scoped>
.users-table-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.top-bar h2 {
  margin: 0;
  color: #333;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 300px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #b71c1c;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

/* Mobile styles */
.user-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-no {
  font-size: 0.9em;
  color: #666;
  font-weight: 600;
}

.user-name {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.user-email {
  font-size: 0.9em;
  color: #666;
}

.user-actions {
  margin-top: 8px;
}

.delete-btn-mobile {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
}

.delete-btn-mobile:hover {
  background: #b71c1c;
}

@media (max-width: 768px) {
  .users-table {
    display: none;
  }
  .user-card-list {
    display: flex;
  }
  .search-input {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .user-card-list {
    display: none;
  }
}
</style>
