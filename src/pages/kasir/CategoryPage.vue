<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">Kategori</div>
    </div>
    <div class="col-6 text-right q-pt-xl q-pr-lg">
      <q-btn to="/superadmin/addcategory" color="primary" text-color="positive" label="Tambah" />
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_kategori"
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
              :to="`/superadmin/editcategory/${props.row.id_kategori}`"
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
              @click="deleteCategory(props.row.id_kategori)"
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
      { name: 'nama_kategori', label: 'Kategori', field: 'nama_kategori', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchCategory = async () => {
      try {
        const response = await api.get('/category')

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((category, index) => ({
            no: index + 1,
            id_kategori: category.id_kategori,
            nama_kategori: category.nama_kategori,
          }))
        } else {
          console.error('Unexpected API response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }

    const deleteCategory = async (id_kategori) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus kategori ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/category/${id_kategori}`)
          fetchCategory()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Kategori berhasil dihapus',
          })
        } catch (error) {
          console.error('Error deleting kategori:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus kategori',
          })
        }
      })
    }

    onMounted(fetchCategory)

    return {
      columns,
      rows,
      filter,
      deleteCategory,
    }
  },
}
</script>

<style scoped></style>
