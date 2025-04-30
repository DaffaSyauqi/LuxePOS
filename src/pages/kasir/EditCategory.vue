<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Kategori</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="updateKategori">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Kategori</label>
        </div>
        <div class="col-10">
          <q-input v-model="kategoriData.nama_kategori" type="text" dense outlined />
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const kategoriData = ref({
      nama_kategori: '',
    })

    const fetchKategoriData = async () => {
      try {
        const response = await api.get(`/category/${route.params.id}`)
        const data = response.data.payload
        kategoriData.value = {
          nama_kategori: data.nama_kategori || '',
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data kategori',
        })
      }
    }

    const updateKategori = async () => {
      try {
        const payload = {
          nama_kategori: kategoriData.value.nama_kategori,
        }
        await api.put(`/category/${route.params.id}`, payload)
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Kategori berhasil diperbarui!',
        })
        router.push('/superadmin/category')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui kategori',
        })
      }
    }

    onMounted(() => {
      fetchKategoriData()
    })

    return { kategoriData, updateKategori }
  },
}
</script>
