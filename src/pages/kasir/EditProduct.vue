<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Produk</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="updateProduct">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama Produk</label>
        </div>
        <div class="col-10">
          <q-input v-model="productData.nama_produk" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Kategori</label>
        </div>
        <div class="col-10">
          <q-select v-model="productData.kategori" :options="options" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Stok</label>
        </div>
        <div class="col-10">
          <q-input v-model="productData.jumlah_produk" type="number" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Harga</label>
        </div>
        <div class="col-10">
          <q-input v-model="productData.harga_produk" type="text" dense outlined />
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
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const productData = ref({
      nama_produk: '',
      kategori: '',
      jumlah_produk: '',
      harga_produk: '',
    })

    const options = ref([])

    const fetchProductData = async () => {
      try {
        const response = await api.get(`/product/${route.params.id}`)
        const data = response.data.payload
        productData.value = {
          nama_produk: data.nama_produk || '',
          kategori: data.kategori || '',
          jumlah_produk: data.jumlah_produk || '',
          harga_produk: data.harga_produk,
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data product',
        })
      }
    }

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

    const updateProduct = async () => {
      try {
        await api.put(`/product/${route.params.id}`, productData.value)
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Produk berhasil diperbarui!',
        })
        router.push('/superadmin/product')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui produk',
        })
      }
    }

    onMounted(() => {
      fetchProductData()
      fetchCategory()
    })

    return { productData, options, updateProduct }
  },
}
</script>
