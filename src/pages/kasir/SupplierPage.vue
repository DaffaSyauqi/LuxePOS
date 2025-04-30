<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">Supplier</div>
    </div>
    <div class="col-6 text-right q-pt-xl q-pr-lg">
      <q-btn to="/superadmin/addsupplier" color="primary" text-color="positive" label="Tambah" />
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_supplier"
      separator="cell"
      :filter="filter"
    >
      <template v-slot:top-left>
        <q-btn
          color="primary"
          text-color="positive"
          icon-right="keyboard_arrow_right"
          label="Export"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-input-rounded"
          outlined
          rounded
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-aksi="props">
        <q-td :props="props">
          <div class="q-pa-sm row justify-center" style="gap: 10px">
            <q-btn
              :to="`/superadmin/editsupplier/${props.row.id_supplier}`"
              dense
              outline
              round
              color="info"
              icon="edit"
            />
            <q-btn
              dense
              outline
              round
              color="warning"
              icon="delete"
              @click="deleteSupplier(props.row.id_supplier)"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const filter = ref('')

    const columns = [
      { name: 'no', label: 'No', field: 'no', align: 'left' },
      { name: 'namaSupplier', label: 'Nama Supplier', field: 'nama_supplier', align: 'left' },
      { name: 'alamat', label: 'Alamat', field: 'alamat', align: 'left' },
      { name: 'noTelepon', label: 'No Telepon', field: 'nomor_telepon', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchSupplier = async () => {
      try {
        const response = await api.get('/supplier')

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((supplier, index) => ({
            no: index + 1,
            id_supplier: supplier.id_supplier,
            nama_supplier: supplier.nama_supplier,
            alamat: supplier.alamat,
            nomor_telepon: supplier.nomor_telepon,
          }))
        } else {
          console.error('Unexpected API response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching supplier:', error)
      }
    }

    const deleteSupplier = async (id_supplier) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus supplier ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/supplier/${id_supplier}`)
          fetchSupplier()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Supplier berhasil dihapus',
          })
        } catch (error) {
          console.error('Error deleting supplier:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus supplier',
          })
        }
      })
    }

    onMounted(fetchSupplier)

    return {
      columns,
      rows,
      filter,
      deleteSupplier,
    }
  },
}
</script>
