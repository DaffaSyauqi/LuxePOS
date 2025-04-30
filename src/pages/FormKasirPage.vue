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

  <div class="q-pa-xl">
    <div class="text-h5 text-center q-pb-xl"><b>Masukkan Kode Toko</b></div>
    <q-form @submit.prevent="submitRequest">
      <q-input v-model="kode_toko" label="Kode Toko" class="q-mb-md" dense outlined />

      <div class="row justify-center q-gutter-md q-pt-md">
        <q-btn type="submit" label="Submit" color="primary" />
        <q-btn to="/choose-role" label="Batal" color="secondary" text-color="black" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

export default {
  setup() {
    const kode_toko = ref('')
    const $q = useQuasar()
    const router = useRouter()
    const userStore = useUserStore()

    const submitRequest = async () => {
      try {
        const response = await api.post(
          '/request-cashier',
          { kode_toko: kode_toko.value },
          { withCredentials: true },
        )

        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: response.data.message,
        })
      } catch (error) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: error.response?.data?.message || 'Terjadi kesalahan',
        })
      }
    }

    async function logout() {
      try {
        await api.post('/logout', {}, { withCredentials: true })
        userStore.resetUser() // Reset state user di store
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error.response?.data || error.message)
      }
    }

    return { kode_toko, submitRequest, logout }
  },
}
</script>
