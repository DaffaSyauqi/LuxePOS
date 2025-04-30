<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Pengaturan</div>

  <div class="q-pa-lg">
    <q-card v-if="activeCard === 'tentang'" class="q-pa-md">
      <div class="custom-gap q-pb-md">
        <q-btn
          color="primary"
          text-color="positive"
          label="Tentang"
          @click="activeCard = 'tentang'"
        />
        <q-btn color="secondary" text-color="dark" label="Profil" @click="activeCard = 'profil'" />
      </div>

      <q-form @submit.prevent="updateStore">
        <q-input
          v-model="storeData.nama_toko"
          label="Nama Toko"
          type="text"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="storeData.deskripsi_toko"
          label="Deskripsi Toko"
          type="text"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="storeData.alamat"
          label="Alamat"
          type="text"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="storeData.nomor_telepon"
          label="No Telepon"
          type="number"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="storeData.kode_toko"
          label="Kode Toko"
          class="q-mb-md"
          dense
          outlined
          readonly
        />
        <q-btn color="primary" text-color="positive" type="submit" label="Simpan" />
      </q-form>
    </q-card>

    <q-card v-if="activeCard === 'profil'" class="q-pa-md">
      <div class="custom-gap q-pb-md">
        <q-btn
          color="secondary"
          text-color="dark"
          label="Tentang"
          @click="activeCard = 'tentang'"
        />
        <q-btn
          color="primary"
          text-color="positive"
          label="Profil"
          @click="activeCard = 'profil'"
        />
      </div>

      <q-form @submit.prevent="updateUser">
        <q-input
          v-model="userData.nama_lengkap"
          label="Nama"
          type="text"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="userData.email"
          label="Email"
          type="email"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="userData.nomor_telepon"
          label="No Telepon"
          type="number"
          class="q-mb-md"
          dense
          outlined
        />
        <q-input
          v-model="userData.password"
          label="Kata Sandi Baru"
          type="password"
          class="q-mb-md"
          dense
          outlined
        />
        <q-btn color="primary" text-color="positive" type="submit" label="Simpan" />
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const activeCard = ref('tentang')
    const userData = ref({
      id_user: null,
      nama_lengkap: '',
      email: '',
      nomor_telepon: '',
      password: '',
      id_toko: null, // Pastikan field ini disertakan
    })

    const storeData = ref({
      nama_toko: '',
      deskripsi_toko: '',
      alamat: '',
      nomor_telepon: '',
      kode_toko: '',
    })

    const refreshAccessToken = async () => {
      try {
        const refreshResponse = await api.post('/refresh-token', {}, { withCredentials: true })
        if (refreshResponse.data?.payload?.accessToken) {
          console.log('Access token diperbarui:', refreshResponse.data.payload.accessToken)
        } else {
          throw new Error(refreshResponse.data.message || 'Refresh token gagal')
        }
      } catch (error) {
        console.error('Gagal memperbarui token:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Sesi berakhir, silakan login ulang',
        })
      }
    }

    const fetchUserData = async () => {
      try {
        let authResponse = await api.get('/profile', { withCredentials: true })

        if (authResponse.data.statusCode === 401) {
          await refreshAccessToken()
          authResponse = await api.get('/profile', { withCredentials: true })
        }

        // Mengambil id_user langsung dari payload
        if (!authResponse.data?.payload?.id_user) {
          throw new Error('ID user tidak ditemukan dalam response profile')
        }

        const userId = authResponse.data.payload.id_user
        let response = await api.get(`/users/${userId}`, { withCredentials: true })

        if (response.data.statusCode === 401) {
          await refreshAccessToken()
          response = await api.get(`/users/${userId}`, { withCredentials: true })
        }

        if (!response.data?.payload) {
          throw new Error('Data user tidak ditemukan')
        }

        const data = response.data.payload
        // Pastikan id_toko diambil jika tersedia
        userData.value = {
          id_user: userId,
          nama_lengkap: data.nama_lengkap || '',
          email: data.email || '',
          nomor_telepon: data.nomor_telepon || '',
          password: '',
          id_toko: data.id_toko || null,
        }
      } catch (error) {
        console.error('Error saat mengambil data user:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data user: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    const updateUser = async () => {
      try {
        const userId = route.params.id_user || userData.value.id_user
        if (!userId) {
          throw new Error('ID user tidak ditemukan')
        }

        const response = await api.put(`/users/${userId}`, userData.value, {
          withCredentials: true,
        })

        if (response.data.statusCode !== 200) {
          throw new Error(response.data.message)
        }

        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: response.data.message || 'User berhasil diperbarui!',
        })
        router.push('/admin/setting')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui user: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    const fetchStoreData = async () => {
      try {
        // Ambil id_toko dari userData (pastikan sudah di-fetch sebelumnya)
        const storeId = userData.value.id_toko
        if (!storeId) {
          throw new Error('ID toko belum tersedia untuk user ini')
        }

        let response = await api.get(`/store/${storeId}`, { withCredentials: true })

        if (response.data.statusCode === 401) {
          await refreshAccessToken()
          response = await api.get(`/store/${storeId}`, { withCredentials: true })
        }

        if (!response.data?.payload) {
          throw new Error('Data toko tidak ditemukan')
        }

        const data = response.data.payload
        storeData.value = {
          nama_toko: data.nama_toko || '',
          deskripsi_toko: data.deskripsi_toko || '',
          alamat: data.alamat || '',
          nomor_telepon: data.nomor_telepon || '',
          kode_toko: data.kode_toko || '',
        }
      } catch (error) {
        console.error('Error saat mengambil data toko:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data toko: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    const updateStore = async () => {
      try {
        // Ambil id_toko dari userData, bukan dari route params
        const storeId = userData.value.id_toko
        if (!storeId) {
          throw new Error('ID toko tidak ditemukan untuk user ini')
        }

        const response = await api.put(`/store/${storeId}`, storeData.value, {
          withCredentials: true,
        })

        if (response.data.statusCode !== 200) {
          throw new Error(response.data.message)
        }

        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: response.data.message || 'Store berhasil diperbarui!',
        })
        router.push('/admin/setting')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui store: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    onMounted(() => {
      fetchUserData().then(() => {
        // Setelah data user diambil, baru fetch data toko
        if (userData.value.id_toko) {
          fetchStoreData()
        }
      })
    })

    return { activeCard, userData, storeData, updateUser, updateStore }
  },
}
</script>
