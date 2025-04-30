<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">Role</div>
    </div>
    <div class="col-6 text-right q-pt-xl q-pr-lg">
      <q-btn to="/superadmin/addrole" color="primary" text-color="positive" label="Tambah" />
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_role"
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
              :to="`/superadmin/permission/${props.row.id_role}`"
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
              @click="deleteRole(props.row.id_role)"
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
      { name: 'role', label: 'Role', field: 'role', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchRole = async () => {
      try {
        const response = await api.get('/role')

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((role, index) => ({
            no: index + 1,
            id_role: role.id_role,
            role: role.nama_role,
          }))
        } else {
          console.error('Unexpected API response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching role:', error)
      }
    }

    const deleteRole = async (id_role) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus role ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/role/${id_role}`)
          fetchRole()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Role berhasil dihapus',
          })
        } catch (error) {
          console.error('Error deleting role:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus role',
          })
        }
      })
    }

    onMounted(fetchRole)

    return {
      columns,
      rows,
      filter,
      deleteRole,
    }
  },
}
</script>
