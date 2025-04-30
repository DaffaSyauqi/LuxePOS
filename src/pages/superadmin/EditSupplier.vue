<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Supplier</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama Supplier</label>
        </div>
        <div class="col-10">
          <q-input v-model="nama_supplier" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Alamat</label>
        </div>
        <div class="col-10">
          <q-input v-model="alamat" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">No Telepon</label>
        </div>
        <div class="col-10">
          <q-input v-model="nomor_telepon" type="text" dense outlined />
        </div>

        <div class="col-2"></div>
        <div class="col-10 row q-gutter-sm">
          <q-btn type="submit" color="primary" text-color="positive" label="Submit" />
          <q-btn to="/superadmin/supplier" color="secondary" text-color="dark" label="Batal" />
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

    const nama_supplier = ref('')
    const alamat = ref('')
    const nomor_telepon = ref('')

    const fetchSupplier = async () => {
      try {
        const response = await api.get(`/supplier/${id}`, { withCredentials: true })
        const data = response.data.payload
        nama_supplier.value = data.nama_supplier
        alamat.value = data.alamat
        nomor_telepon.value = data.nomor_telepon
      } catch (error) {
        console.error('Gagal mengambil data supplier:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data supplier',
        })
      }
    }

    const submitForm = async () => {
      if (!nama_supplier.value || !alamat.value || !nomor_telepon.value) {
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
          `/supplier/${id}`,
          {
            nama_supplier: nama_supplier.value,
            alamat: alamat.value,
            nomor_telepon: nomor_telepon.value,
          },
          { withCredentials: true },
        )

        if (response.status === 200) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Supplier berhasil diperbarui!',
          })
          router.push('/superadmin/supplier')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal memperbarui supplier',
          })
        }
      } catch (error) {
        console.error('Gagal memperbarui supplier', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui supplier',
        })
      }
    }

    onMounted(async () => {
      fetchSupplier()
    })

    return { nama_supplier, alamat, nomor_telepon, submitForm }
  },
}
</script>
