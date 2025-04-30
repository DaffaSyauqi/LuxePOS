<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Tambah Produk</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama Produk</label>
        </div>
        <div class="col-10">
          <q-input v-model="nama_produk" type="text" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Kategori</label>
        </div>
        <div class="col-10">
          <q-select v-model="kategori" :options="options" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Stok</label>
        </div>
        <div class="col-10">
          <q-input v-model="jumlah_produk" type="number" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Harga</label>
        </div>
        <div class="col-10">
          <q-input v-model="harga_produk" type="number" dense outlined required />
        </div>

        <div class="col-2"></div>
        <div class="col-10 row q-gutter-sm">
          <q-btn type="submit" color="primary" text-color="positive" label="Submit" />
          <q-btn to="/superadmin/product" color="secondary" text-color="dark" label="Batal" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const nama_produk = ref('')
    const kategori = ref(null)
    const jumlah_produk = ref('')
    const harga_produk = ref('')
    const options = ref([])

    const fetchCategory = async () => {
      try {
        const response = await api.get('/category')
        if (response.data && response.data.payload) {
          options.value = response.data.payload.map((r) => r.nama_kategori)
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal mengambil data kategori',
          })
        }
      } catch (error) {
        console.error('Error saat mengambil data kategori:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Terjadi kesalahan, coba lagi nanti',
        })
      }
    }

    const submitForm = async () => {
      if (!nama_produk.value || !kategori.value || !jumlah_produk.value || !harga_produk.value) {
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
        const response = await api.post('/product', {
          nama_produk: nama_produk.value,
          kategori: kategori.value,
          jumlah_produk: jumlah_produk.value,
          harga_produk: harga_produk.value,
        })

        if (response.status === 200 || response.status === 201) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Produk berhasil ditambahkan!',
          })
          router.push('/superadmin/product')
          nama_produk.value = ''
          kategori.value = null
          jumlah_produk.value = ''
          harga_produk.value = ''
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal menambahkan produk',
          })
        }
      } catch (error) {
        console.error('Error saat mengirim data:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Terjadi kesalahan, coba lagi nanti',
        })
      }
    }

    onMounted(() => {
      fetchCategory()
    })

    return {
      nama_produk,
      kategori,
      jumlah_produk,
      harga_produk,
      options,
      submitForm,
    }
  },
}
</script>
