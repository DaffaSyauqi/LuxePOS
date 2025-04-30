<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Produk</div>

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
          <q-select
            v-model="kategori"
            :options="options"
            option-label="label"
            option-value="value"
            dense
            outlined
            required
          />
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

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Gambar</label>
        </div>
        <div class="col-10">
          <q-uploader
            label="Upload Gambar"
            accept="image/*"
            :auto-upload="false"
            :hide-upload-btn="true"
            @added="onFileAdded"
            ref="uploader"
            dense
            outlined
            style="max-width: 300px"
          />
        </div>

        <div class="col-2"></div>
        <div class="col-10 row q-gutter-sm">
          <q-btn type="submit" color="primary" text-color="positive" label="Submit" />
          <q-btn to="/admin/product" color="secondary" text-color="dark" label="Batal" />
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

    const nama_produk = ref('')
    const kategori = ref(null)
    const jumlah_produk = ref('')
    const harga_produk = ref('')
    const gambar = ref(null)
    const options = ref([])
    const idToko = ref(null)

    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/profile', { withCredentials: true })
        if (res.data?.payload?.id_toko) {
          idToko.value = res.data.payload.id_toko
          await fetchCategory()
          await fetchProduct()
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

    const fetchCategory = async () => {
      try {
        const res = await api.get('/category', { withCredentials: true })
        if (res.data && Array.isArray(res.data.payload)) {
          const filtered = res.data.payload.filter((item) => item.id_toko === idToko.value)
          options.value = filtered.map((kategori) => ({
            label: kategori.nama_kategori,
            value: kategori.id_kategori,
          }))
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Data kategori tidak valid',
          })
        }
      } catch (error) {
        console.error('Error saat mengambil kategori:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data kategori',
        })
      }
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`, { withCredentials: true })
        const data = res.data.payload
        nama_produk.value = data.nama_produk
        kategori.value = options.value.find((opt) => opt.label === data.kategori)
        jumlah_produk.value = data.jumlah_produk
        harga_produk.value = data.harga_produk
      } catch (error) {
        console.error('Gagal mengambil data produk:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data produk',
        })
      }
    }

    const onFileAdded = (files) => {
      gambar.value = files[0] || null
    }

    const submitForm = async () => {
      if (!nama_produk.value || !kategori.value || !jumlah_produk.value || !harga_produk.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Semua field wajib diisi!',
        })
        return
      }

      const formData = new FormData()
      formData.append('nama_produk', nama_produk.value)
      formData.append('kategori', kategori.value.label)
      formData.append('jumlah_produk', jumlah_produk.value)
      formData.append('harga_produk', harga_produk.value)

      if (gambar.value) {
        formData.append('gambar', gambar.value)
      }

      try {
        const response = await api.put(`/product/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.status === 200) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Produk berhasil diperbarui!',
          })
          router.push('/admin/product')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal memperbarui produk',
          })
        }
      } catch (error) {
        console.error('Gagal memperbarui produk:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui produk',
        })
      }
    }

    onMounted(async () => {
      await fetchUserProfile()
    })

    return {
      nama_produk,
      kategori,
      jumlah_produk,
      harga_produk,
      options,
      submitForm,
      onFileAdded,
    }
  },
}
</script>
