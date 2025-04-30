<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">Confirm Cashier</div>
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_request"
      separator="cell"
      :filter="filter"
      flat
      bordered
    >
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
          <q-btn color="primary" label="Confirm" @click="confirmRequest(props.row.id_request)" />
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
  name: 'ConfirmCashierRequests',
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const columns = ref([
      {
        name: 'no',
        label: 'No',
        align: 'left',
        field: 'no',
      },
      {
        name: 'user',
        label: 'User',
        align: 'left',
        field: 'user',
      },
      { name: 'status', label: 'Status', align: 'left', field: 'status' },
      { name: 'aksi', label: 'Aksi', align: 'center' },
    ])

    // Fungsi untuk fetch data request kasir pending (pastikan endpoint GET ini sudah tersedia)
    const fetchRequests = async () => {
      try {
        const response = await api.get('/confirm-cashier', { withCredentials: true })

        rows.value = response.data.payload.map((data, index) => ({
          no: index + 1,
          id_request: data.id_request,
          user: data.user.nama_lengkap,
          status: data.status,
        }))
      } catch (error) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message:
            'Gagal mengambil data request: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    // Fungsi untuk mengkonfirmasi request kasir
    const confirmRequest = async (id_request) => {
      try {
        const response = await api.post(
          '/confirm-cashier',
          { id_request },
          { withCredentials: true },
        )
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: response.data.message || 'Request dikonfirmasi!',
        })
        // Refresh data table setelah konfirmasi
        await fetchRequests()
      } catch (error) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message:
            'Gagal mengkonfirmasi request: ' + (error.response?.data?.message || error.message),
        })
      }
    }

    onMounted(() => {
      fetchRequests()
    })

    return { rows, columns, confirmRequest }
  },
}
</script>
