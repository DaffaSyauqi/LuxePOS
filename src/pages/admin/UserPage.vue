<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">User</div>
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_user"
      separator="cell"
      :filter="filter"
      flat
      bordered
    >
      <template v-slot:top-left>
        <q-btn-dropdown
          color="primary"
          text-color="positive"
          label="Export"
          dropdown-icon="arrow_drop_down"
        >
          <q-list>
            <q-item clickable v-close-popup @click="exportToPDF">
              <q-item-section avatar>
                <q-avatar icon="picture_as_pdf" color="warning" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>PDF</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportToExcel">
              <q-item-section avatar>
                <q-avatar icon="grid_on" color="accent" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Excel</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
              dense
              outline
              round
              color="warning"
              icon="delete"
              @click="deleteUser(props.row.id_user)"
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
import { api } from '../../boot/axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const filter = ref('')
    const idToko = ref(null)

    const columns = [
      { name: 'no', label: 'No', field: 'no', align: 'left' },
      { name: 'nama_lengkap', label: 'Nama', field: 'nama_lengkap', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'nomor_telepon', label: 'No Telepon', field: 'nomor_telepon', align: 'left' },
      { name: 'role', label: 'Role', field: 'role', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

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

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', { withCredentials: true })

        if (response.data && Array.isArray(response.data.payload)) {
          const filtered = response.data.payload.filter((p) => p.id_toko === idToko.value)

          rows.value = filtered.map((user, index) => ({
            no: index + 1,
            id_user: user.id_user,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            nomor_telepon: user.nomor_telepon,
            role: user.role,
          }))
        } else {
          console.error('Data user tidak valid:', response.data)
        }
      } catch (error) {
        console.error('Gagal mengambil user:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil user',
        })
      }
    }

    const deleteUser = async (id_user) => {
      $q.dialog({
        title: 'Konfirmasi',
        message:
          'Apakah Anda yakin ingin menghapus user ini? (Harus menghapus transaksi yang terkait)',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/users/${id_user}`, {
            withCredentials: true,
          })
          fetchUsers()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'User berhasil dihapus',
          })
        } catch (error) {
          console.error('Gagal menghapus user:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus user',
          })
        }
      })
    }

    onMounted(async () => {
      await fetchUserProfile()
      await fetchUsers()
    })

    const exportToPDF = () => {
      const doc = new jsPDF()
      const tableColumn = columns.filter((col) => col.name !== 'aksi').map((col) => col.label)
      const tableRows = rows.value.map((row) =>
        columns.filter((col) => col.name !== 'aksi').map((col) => row[col.name]),
      )

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
      })

      doc.save('user.pdf')
    }

    const exportToExcel = () => {
      const worksheetData = [
        columns.filter((col) => col.name !== 'aksi').map((col) => col.label),
        ...rows.value.map((row) =>
          columns.filter((col) => col.name !== 'aksi').map((col) => row[col.name]),
        ),
      ]

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'User')
      XLSX.writeFile(workbook, 'user.xlsx')
    }

    return {
      columns,
      rows,
      filter,
      deleteUser,
      exportToPDF,
      exportToExcel,
    }
  },
}
</script>
