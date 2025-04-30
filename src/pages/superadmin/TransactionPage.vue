<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Riwayat Transaksi</div>

  <div class="q-pa-lg">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id_transaksi"
      separator="cell"
      :filter="filter"
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
              color="info"
              icon="info"
              @click="showTransactionDetail(props.row.id_transaksi)"
            />
            <q-btn
              dense
              outline
              round
              color="warning"
              icon="delete"
              @click="deleteTransaction(props.row.id_transaksi)"
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogDetail">
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="text-h6">Detail Transaksi</q-card-section>

        <q-card-section>
          <div v-if="selectedDetail">
            <div><strong>Invoice:</strong> {{ selectedDetail.nomor_invoice }}</div>
            <div><strong>Tanggal:</strong> {{ formatDate(selectedDetail.tanggal) }}</div>
            <div><strong>Total:</strong> {{ formatCurrency(selectedDetail.total) }}</div>
            <div><strong>Dibayar:</strong> {{ formatCurrency(selectedDetail.uang_dibayar) }}</div>
            <div>
              <strong>Kembalian:</strong> {{ formatCurrency(selectedDetail.uang_kembalian) }}
            </div>

            <div class="q-mt-md"><strong>Daftar Produk:</strong></div>
            <q-list bordered>
              <q-item v-for="item in selectedDetail.detail" :key="item.id_detail">
                <q-item-section>
                  <div><strong>Nama Produk:</strong> {{ item.nama_produk }}</div>
                  <div><strong>Harga:</strong> {{ formatCurrency(item.harga) }}</div>
                  <div><strong>Jumlah:</strong> {{ item.jumlah }}</div>
                  <div><strong>Subtotal:</strong> {{ formatCurrency(item.subtotal) }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Tutup" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  setup() {
    const $q = useQuasar()
    const rows = ref([])
    const filter = ref('')
    const idToko = ref(null)

    const dialogDetail = ref(false)
    const selectedDetail = ref(null)

    const columns = [
      { name: 'no', label: 'No', field: 'no', align: 'left' },
      { name: 'nomor_invoice', label: 'No Invoice', field: 'nomor_invoice', align: 'left' },
      { name: 'tanggal', label: 'Tanggal', field: 'tanggal', align: 'left' },
      { name: 'total', label: 'Total', field: 'total', align: 'left' },
      { name: 'uang_dibayar', label: 'Uang Dibayar', field: 'uang_dibayar', align: 'left' },
      { name: 'uang_kembalian', label: 'Uang Kembalian', field: 'uang_kembalian', align: 'left' },
      { name: 'kasir', label: 'Kasir', field: 'kasir', align: 'left' },
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

    const fetchTransaction = async () => {
      try {
        const response = await api.get('/transaction', { withCredentials: true })

        if (response.data && Array.isArray(response.data.payload)) {
          const filtered = response.data.payload.filter((p) => p.id_toko === idToko.value)

          rows.value = filtered.map((transaction, index) => ({
            no: index + 1,
            id_transaksi: transaction.id_transaksi,
            nomor_invoice: transaction.nomor_invoice,
            tanggal: formatDate(transaction.tanggal),
            total: formatCurrency(transaction.total),
            uang_dibayar: formatCurrency(transaction.uang_dibayar),
            uang_kembalian: formatCurrency(transaction.uang_kembalian),
            kasir: transaction.kasir.nama_lengkap,
          }))
        } else {
          console.error('Data transaksi tidak valid:', response.data)
        }
      } catch (error) {
        console.error('Gagal mengambil riwayat transaksi:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil riwayat transaksi',
        })
      }
    }

    const showTransactionDetail = async (id_transaksi) => {
      try {
        const res = await api.get(`/transaction/${id_transaksi}`, { withCredentials: true })
        selectedDetail.value = res.data.payload
        dialogDetail.value = true
      } catch (error) {
        console.error('Gagal mengambil detail transaksi:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil detail transaksi',
        })
      }
    }

    const deleteTransaction = async (id_transaksi) => {
      $q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menghapus transaksi ini?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/transaction/${id_transaksi}`, {
            withCredentials: true,
          })
          fetchTransaction()
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Transaksi berhasil dihapus',
          })
        } catch (error) {
          console.error('Gagal menghapus transaksi:', error)
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal menghapus transaksi',
          })
        }
      })
    }

    onMounted(async () => {
      await fetchUserProfile()
      await fetchTransaction()
    })

    const formatDate = (tanggalISO) => {
      const tanggal = new Date(tanggalISO)
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      }).format(tanggal)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    }

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

      doc.save('riwayat-transaksi.pdf')
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Transaksi')
      XLSX.writeFile(workbook, 'riwayat-transaksi.xlsx')
    }

    return {
      columns,
      rows,
      filter,
      dialogDetail,
      selectedDetail,
      showTransactionDetail,
      deleteTransaction,
      formatDate,
      formatCurrency,
      exportToPDF,
      exportToExcel,
    }
  },
}
</script>
