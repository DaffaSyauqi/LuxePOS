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
    <div class="text-h5 text-center q-pb-xl"><b>Atur Toko Anda</b></div>
    <q-form @submit.prevent="submitForm">
      <q-input v-model="nama_toko" label="Nama Toko" class="q-mb-md" dense outlined />
      <q-input
        v-model="deskripsi_toko"
        label="Deskripsi Toko"
        class="q-mb-md"
        dense
        outlined
        type="textarea"
      />
      <q-input v-model="alamat" label="Alamat Toko" class="q-mb-md" dense outlined />
      <q-input
        v-model="nomor_telepon"
        label="No Telepon"
        class="q-mb-md"
        dense
        outlined
        type="number"
      />

      <div class="row justify-center q-gutter-md q-pt-md">
        <q-btn type="submit" label="Submit" color="primary" />
        <q-btn to="/choose-role" label="Batal" color="secondary" text-color="black" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()

const nama_toko = ref('')
const deskripsi_toko = ref('')
const alamat = ref('')
const nomor_telepon = ref('')

async function submitForm() {
  try {
    const payload = {
      nama_toko: nama_toko.value,
      deskripsi_toko: deskripsi_toko.value,
      alamat: alamat.value,
      nomor_telepon: nomor_telepon.value,
    }

    const response = await api.post('/become-admin', payload, { withCredentials: true })

    // Ambil data dari response.data.payload
    const data = response.data.payload
    const role = data.role
    const nama_lengkap = data.nama_lengkap

    // Update store agar role dan nama lengkap langsung reaktif
    userStore.setRole(role)
    userStore.setNamaLengkap(nama_lengkap)

    $q.notify({
      position: 'right',
      color: 'green-5',
      textColor: 'white',
      icon: 'check_circle',
      message: response.data.message || 'Toko berhasil diatur!',
    })

    router.push('/admin/dashboard')
  } catch (error) {
    $q.notify({
      position: 'right',
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: error.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi',
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
</script>

<style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>
