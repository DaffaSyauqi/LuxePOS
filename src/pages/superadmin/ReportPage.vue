<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Laporan</div>

  <div class="q-pa-lg">
    <q-table :rows="rows" :columns="columns" row-key="name" separator="cell">
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
    </q-table>
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
      { name: 'jumlah', label: 'Jumlah', field: 'jumlah', align: 'left' },
      { name: 'kasir', label: 'Kasir', field: 'kasir', align: 'left' },
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
        const { data } = await api.get('/transaction', { withCredentials: true })

        if (!data || !Array.isArray(data.payload)) {
          console.error('Data transaksi tidak valid:', data)
          return
        }

        const filtered = data.payload.filter((p) => p.id_toko === idToko.value)

        // Ambil semua detail transaksi dalam Promise.all tapi batasi jumlah permintaan paralel
        const transactionWithDetails = await Promise.allSettled(
          filtered.map(async (transaction, index) => {
            const transaksiBaru = {
              no: index + 1,
              id_transaksi: transaction.id_transaksi,
              nomor_invoice: transaction.nomor_invoice,
              tanggal: formatDate(transaction.tanggal),
              total: formatCurrency(transaction.total),
              jumlah: 0,
              kasir: transaction.kasir?.nama_lengkap || '-',
            }

            try {
              const { data: detailData } = await api.get(
                `/transaction/${transaction.id_transaksi}`,
                { withCredentials: true },
              )
              transaksiBaru.jumlah =
                detailData?.payload?.detail?.reduce((sum, item) => sum + item.jumlah, 0) || 0
            } catch (err) {
              console.error(`Gagal ambil detail transaksi ID ${transaction.id_transaksi}:`, err)
            }

            return transaksiBaru
          }),
        )

        // Hanya ambil yang statusnya fulfilled
        rows.value = transactionWithDetails
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
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

      doc.save('laporan.pdf')
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')
      XLSX.writeFile(workbook, 'laporan.xlsx')
    }

    return {
      columns,
      rows,
      filter,
      dialogDetail,
      selectedDetail,
      formatDate,
      formatCurrency,
      exportToPDF,
      exportToExcel,
    }
  },
}
</script>
