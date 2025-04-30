<template>
  <div class="row">
    <div class="col-6 q-pt-xl q-pl-lg">
      <div class="text-h4">Produk</div>
    </div>
    <div class="col-6 text-right q-pt-xl q-pr-lg">
      <q-btn to="/superadmin/addproduct" color="primary" text-color="positive" label="Tambah" />
    </div>
  </div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_produk"
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
              :to="`/superadmin/editproduct/${props.row.id_produk}`"
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
              @click="deleteProduct(props.row.id_produk)"
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
      { name: 'nama', label: 'Nama', field: 'nama_produk', align: 'left' },
      { name: 'kategori', label: 'Kategori', field: 'kategori', align: 'left' },
      { name: 'stok', label: 'Stok', field: 'jumlah_produk', align: 'left' },
      { name: 'harga', label: 'Harga', field: 'harga_produk', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchProduct = async () => {
      try {
        const response = await api.get('/product')

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((product, index) => ({
            no: index + 1,
            id_produk: product.id_produk,
            nama_produk: product.nama_produk,
            kategori: product.kategori,
            jumlah_produk: product.jumlah_produk,
            harga_produk: product.harga_produk,
          }))
        } else {
          console.error('Unexpected API response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    const deleteProduct = async (id_produk) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus produk ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/product/${id_produk}`)
          fetchProduct()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Produk berhasil dihapus',
          })
        } catch (error) {
          console.error('Error deleting product:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Produk gagal dihapus',
          })
        }
      })
    }

    onMounted(fetchProduct)

    return {
      columns,
      rows,
      filter,
      deleteProduct,
    }
  },
}
</script>
