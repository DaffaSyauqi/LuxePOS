<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Tambah Kategori</div>

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
          <q-btn to="/superadmin/category" color="secondary" text-color="dark" label="Batal" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const nama_kategori = ref('')

    const submitForm = async () => {
      if (!nama_kategori.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Semua field harus diisi!',
        })
        return
      }

      try {
        const response = await api.post('/category', {
          nama_kategori: nama_kategori.value,
        })

        if (response.status === 200 || response.status === 201) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Kategori berhasil ditambahkan!',
          })
          router.push('/superadmin/category')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal menambahkan kategori',
          })
        }
      } catch (error) {
        console.error('Error saat kirim data:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Terjadi kesalahan, coba lagi nanti',
        })
      }
    }

    return {
      nama_kategori,
      submitForm,
    }
  },
}
</script>
