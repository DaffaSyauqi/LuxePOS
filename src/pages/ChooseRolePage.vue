<template>
  <div class="q-pa-sm q-pl-md q-pr-md">
    <q-toolbar class="bg-transparent">
      <!-- Logo / Brand di kiri -->
      <div class="row items-center">
        <img src="../assets/icon2.png" alt="logo" class="logo-img" />
        <q-item-label header class="logo-text">LuxePoS</q-item-label>
      </div>

      <q-space />

      <!-- Tombol Login & Register di kanan -->
      <div class="row items-center justify-end">
        <q-btn color="primary" label="Logout" v-close-popup @click="logout" />
      </div>
    </q-toolbar>
  </div>

  <div class="flex flex-center absolute-center q-col-gutter-md">
    <!-- Kartu Kasir -->
    <q-card class="role-card q-mr-md qursor-pointer" @click="goToKasir">
      <q-card-section class="flex flex-center column">
        <q-icon name="people" size="80px" />
        <div class="text-h6 q-mt-md">Kasir</div>
        <div class="text-subtitle2 text-center">cari toko, kelola bisnis.</div>
      </q-card-section>
    </q-card>

    <!-- Kartu Pemilik Toko -->
    <q-card class="role-card q-ml-md qursor-pointer" @click="goToAdmin">
      <q-card-section class="flex flex-center column">
        <q-icon name="store" size="80px" />
        <div class="text-h6 q-mt-md">Pemilik Toko</div>
        <div class="text-subtitle2 text-center">buat bisnis, kelola bisnis, dan berkreasi.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

export default {
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    async function logout() {
      try {
        await api.post('/logout', {}, { withCredentials: true })
        userStore.resetUser() // Reset state user di store
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error.response?.data || error.message)
      }
    }

    function goToKasir() {
      router.push('/form-kasir')
    }

    function goToAdmin() {
      router.push('/form-admin')
    }

    return { logout, goToKasir, goToAdmin }
  },
}
</script>

<style scoped>
.role-card {
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
