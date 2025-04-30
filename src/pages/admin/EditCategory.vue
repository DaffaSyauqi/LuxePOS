<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Kategori</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Kategori</label>
        </div>
        <div class="col-10">
          <q-input v-model="nama_kategori" type="text" dense outlined required />
        </div>

        <div class="col-2"></div>
        <div class="col-10 row q-gutter-sm">
          <q-btn type="submit" color="primary" text-color="positive" label="Submit" />
          <q-btn to="/admin/category" color="secondary" text-color="dark" label="Batal" />
        </div>
      </div>
    </q-form>
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

    const id = route.params.id

    const nama_kategori = ref('')
    const idToko = ref(null)

    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/profile', { withCredentials: true })
        if (res.data?.payload?.id_toko) {
          idToko.value = res.data.payload.id_toko
        } else {
          throw new Error('id_toko tidak ditemukan')
        }
      } catch (error) {
        console.error('Gagal mengambil profil:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data pengguna',
        })
      }
    }

    const fetchCategori = async () => {
      try {
        const response = await api.get(`/category/${id}`, { withCredentials: true })
        const data = response.data.payload
        nama_kategori.value = data.nama_kategori
      } catch (error) {
        console.error('Gagal mengambil data kategori:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data kategori',
        })
      }
    }

    const submitForm = async () => {
      if (!nama_kategori.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Semua field wajib diisi!',
        })
        return
      }

      try {
        const response = await api.put(
          `/category/${id}`,
          {
            nama_kategori: nama_kategori.value,
          },
          { withCredentials: true },
        )

        if (response.status === 200) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Kategori berhasil diperbarui!',
          })
          router.push('/admin/category')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal memperbarui kategori',
          })
        }
      } catch (error) {
        console.error('Gagal memperbarui kategori', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui kategori',
        })
      }
    }

    onMounted(async () => {
      fetchUserProfile()
      fetchCategori()
    })

    return { nama_kategori, submitForm }
  },
}
</script>
