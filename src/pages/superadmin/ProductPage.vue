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

      <template v-slot:body-cell-gambar="props">
        <q-td :props="props">
          <img
            v-if="props.row.gambar"
            :src="`/assets/uploads/produk/${props.row.gambar}`"
            alt="gambar"
            style="width: 80px; height: auto; border-radius: 8px"
          />
          <span v-else>-</span>
        </q-td>
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const filter = ref('')

    const columns = [
      { name: 'no', label: 'No', field: 'no', align: 'left' },
      { name: 'gambar', label: 'Gambar', field: 'gambar', align: 'left' },
      { name: 'nama_produk', label: 'Nama', field: 'nama_produk', align: 'left' },
      { name: 'kategori', label: 'Kategori', field: 'kategori', align: 'left' },
      { name: 'jumlah_produk', label: 'Stok', field: 'jumlah_produk', align: 'left' },
      { name: 'harga_produk', label: 'Harga', field: 'harga_produk', align: 'left' },
      { name: 'created_by', label: 'id_user', field: 'created_by', align: 'left' },
      { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'left' },
    ]

    const fetchProduct = async () => {
      try {
        const response = await api.get('/product', { withCredentials: true })

        if (response.data && Array.isArray(response.data.payload)) {
          rows.value = response.data.payload.map((product, index) => ({
            no: index + 1,
            id_produk: product.id_produk,
            nama_produk: product.nama_produk,
            kategori: product.kategori,
            jumlah_produk: product.jumlah_produk,
            harga_produk: formatCurrency(product.harga_produk),
            gambar: product.gambar,
            created_by: product.created_by,
          }))
        } else {
          console.error('Data produk tidak valid:', response.data)
        }
      } catch (error) {
        console.error('Gagal mengambil produk:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil produk',
        })
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
          await api.delete(`/product/${id_produk}`, {
            withCredentials: true,
          })
          fetchProduct()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Produk berhasil dihapus',
          })
        } catch (error) {
          console.error('Gagal menghapus produk:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus produk',
          })
        }
      })
    }

    onMounted(async () => {
      await fetchProduct()
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    }

    const exportToPDF = () => {
      const doc = new jsPDF()

      const tableColumn = columns
        .filter((col) => col.name !== 'aksi' && col.name !== 'gambar')
        .map((col) => col.label)

      const tableRows = rows.value.map((row) =>
        columns
          .filter((col) => col.name !== 'aksi' && col.name !== 'gambar')
          .map((col) => row[col.name]),
      )

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
      })

      doc.save('produk.pdf')
    }

    const exportToExcel = () => {
      const worksheetData = [
        columns
          .filter((col) => col.name !== 'aksi' && col.name !== 'gambar')
          .map((col) => col.label),
        ...rows.value.map((row) =>
          columns
            .filter((col) => col.name !== 'aksi' && col.name !== 'gambar')
            .map((col) => row[col.name]),
        ),
      ]

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Produk')
      XLSX.writeFile(workbook, 'produk.xlsx')
    }

    return {
      columns,
      rows,
      filter,
      deleteProduct,
      formatCurrency,
      exportToPDF,
      exportToExcel,
    }
  },
}
</script>
