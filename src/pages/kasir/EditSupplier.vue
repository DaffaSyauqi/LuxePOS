<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit Supplier</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="updateSupplier">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama Supplier</label>
        </div>
        <div class="col-10">
          <q-input v-model="supplierData.nama_supplier" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Alamat</label>
        </div>
        <div class="col-10">
          <q-input v-model="supplierData.alamat" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">No Telepon</label>
        </div>
        <div class="col-10">
          <q-input v-model="supplierData.nomor_telepon" type="text" dense outlined />
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

    const supplierData = ref({
      nama_supplier: '',
      alamat: '',
      nomor_telepon: '',
    })

    const fetchSupplierData = async () => {
      try {
        const response = await api.get(`/supplier/${route.params.id}`)
        const data = response.data.payload
        supplierData.value = {
          nama_supplier: data.nama_supplier || '',
          alamat: data.alamat || '',
          nomor_telepon: data.nomor_telepon || '',
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data supplier',
        })
      }
    }

    const updateSupplier = async () => {
      try {
        const payload = {
          nama_supplier: supplierData.value.nama_supplier,
          alamat: supplierData.value.alamat,
          nomor_telepon: supplierData.value.nomor_telepon,
        }
        await api.put(`/supplier/${route.params.id}`, payload)
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Supplier berhasil diperbarui!',
        })
        router.push('/superadmin/supplier')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui supplier',
        })
      }
    }

    onMounted(() => {
      fetchSupplierData()
    })

    return { supplierData, updateSupplier }
  },
}
</script>
