<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">User</div>
    </div>
    <div class="col-6 text-right q-pt-xl q-pr-lg">
      <q-btn to="/superadmin/adduser" color="primary" text-color="positive" label="Tambah" />
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
              :to="`/superadmin/edituser/${props.row.id_user}`"
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

export default {
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const filter = ref('')

    const columns = [
      { name: 'no', label: 'No', field: 'no', align: 'left' },
      { name: 'nama_lengkap', label: 'Nama', field: 'nama_lengkap', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'nomor_telepon', label: 'No Telepon', field: 'nomor_telepon', align: 'left' },
      { name: 'role', label: 'Role', field: 'role', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', { withCredentials: true })

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((user, index) => ({
            no: index + 1,
            id_user: user.id_user,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            nomor_telepon: user.nomor_telepon,
            role: user.role,
          }))
        } else {
          console.error('Unexpected API response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const deleteUser = async (id_user) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus user ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/users/${id_user}`, { withCredentials: true })
          fetchUsers()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'User berhasil dihapus',
          })
        } catch (error) {
          console.error('Error deleting user:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'User gagal dihapus',
          })
        }
      })
    }

    onMounted(fetchUsers)

    return {
      columns,
      rows,
      filter,
      deleteUser,
    }
  },
}
</script>
