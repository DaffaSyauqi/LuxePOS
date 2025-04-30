<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Dashboard</div>

  <div class="q-pa-lg">
    <div class="text-h5">Laporan Hari Ini</div>
    <div class="row items-start justify-start q-pt-md" style="gap: 10px">
      <q-card flat bordered class="my-card" style="width: 200px; text-align: center">
        <q-card-section>
          <div class="text-subtitle2">Total Penjualan Hari Ini</div>
          <div class="text-h6">Rp{{ formatRupiah(totalHariIni) }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="my-card" style="width: 200px; text-align: center">
        <q-card-section>
          <div class="text-subtitle2">Total Penjualan Bulan Ini</div>
          <div class="text-h6">Rp{{ formatRupiah(totalBulanIni) }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="my-card" style="width: 200px; text-align: center">
        <q-card-section>
          <div class="text-subtitle2">Total Penjualan</div>
          <div class="text-h6">Rp{{ formatRupiah(totalKeseluruhan) }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="my-card" style="width: 200px; text-align: center">
        <q-card-section>
          <div class="text-subtitle2">Total Pelanggan</div>
          <div class="text-h6">{{ totalPelanggan }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row items-start justify-start q-pt-md" style="gap: 10px">
      <q-card flat bordered class="my-card" style="width: 410px">
        <q-card-section>
          <div class="text-h5">Produk Terlaris</div>
          <canvas id="pie-chart" width="100%"></canvas>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="my-card" style="width: 410px">
        <q-card-section>
          <div class="text-h5">Stok</div>
          <p style="font-size: 14px">*Produk dengan stok paling banyak</p>
          <div class="row">
            <div class="col-6">
              <div class="text-body2">
                <b><i>Produk</i></b>
              </div>
              <div class="text-body2" v-for="item in topProducts" :key="item.id_produk">
                {{ item.nama_produk }}
              </div>
            </div>
            <div class="col-6" style="text-align: right">
              <div class="text-body2" style="font-style: italic"><b>Stok</b></div>
              <div
                class="text-body2"
                v-for="item in topProducts"
                :key="item.id_produk"
                :style="item.jumlah_produk === 0 ? 'color: red; font-weight: bold' : ''"
              >
                {{ item.jumlah_produk === 0 ? 'Habis' : item.jumlah_produk }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'

export default {
  setup() {
    const $q = useQuasar()
    const idToko = ref(null)
    const products = ref([])
    const productBestseller = ref([])
    const transaksi = ref([])

    const totalHariIni = ref(0)
    const totalBulanIni = ref(0)
    const totalKeseluruhan = ref(0)
    const totalPelanggan = ref(0)

    let pieChartInstance = null

    const topProducts = computed(() => {
      return [...products.value].sort((a, b) => b.jumlah_produk - a.jumlah_produk).slice(0, 10)
    })

    const formatRupiah = (value) => {
      return value.toLocaleString('id-ID')
    }

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

    const fetchProduct = async () => {
      try {
        const res = await api.get('/product', { withCredentials: true })
        if (res.data && Array.isArray(res.data.payload)) {
          products.value = res.data.payload.filter((p) => p.id_toko === idToko.value)
        } else {
          console.error('Data produk tidak valid:', res.data)
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

    const fetchProductBestseller = async () => {
      try {
        const res = await api.get(`/product-bestseller?id_toko=${idToko.value}`, {
          withCredentials: true,
        })
        if (res.data && Array.isArray(res.data.payload)) {
          productBestseller.value = res.data.payload.slice(0, 5)
          renderPieChart()
        }
      } catch (error) {
        console.error('Gagal mengambil produk terlaris:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil produk terlaris',
        })
      }
    }

    const fetchTransaksi = async () => {
      try {
        const res = await api.get(`/transaction?id_toko=${idToko.value}`, { withCredentials: true })
        if (res.data && Array.isArray(res.data.payload)) {
          transaksi.value = res.data.payload
          hitungPenjualan()
        } else {
          console.error('Data transaksi tidak valid:', res.data)
        }
      } catch (error) {
        console.error('Gagal mengambil transaksi:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil transaksi',
        })
      }
    }

    const hitungPenjualan = () => {
      const today = dayjs()

      totalHariIni.value = 0
      totalBulanIni.value = 0
      totalKeseluruhan.value = 0
      totalPelanggan.value = transaksi.value.length

      transaksi.value.forEach((trx) => {
        const trxDate = dayjs(trx.created_at)
        const totalHarga = Number(trx.total)

        if (trxDate.isSame(today, 'day')) {
          totalHariIni.value += totalHarga
        }

        if (trxDate.isSame(today, 'month')) {
          totalBulanIni.value += totalHarga
        }

        totalKeseluruhan.value += totalHarga
      })
    }

    const renderPieChart = () => {
      const ctx = document.getElementById('pie-chart')
      if (!ctx) return

      if (pieChartInstance) {
        pieChartInstance.destroy()
      }

      pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: productBestseller.value.map((item) => item.nama_produk),
          datasets: [
            {
              label: 'Total Terjual',
              data: productBestseller.value.map((item) => item.total_terjual),
              backgroundColor: ['#0274F3', '#499AF5', '#51ADF6', '#5BB7FF', '#7EBBFF'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      })
    }

    onMounted(async () => {
      await fetchUserProfile()
      await fetchProduct()
      await fetchProductBestseller()
      await fetchTransaksi()
    })

    return {
      products,
      topProducts,
      productBestseller,
      totalHariIni,
      totalBulanIni,
      totalKeseluruhan,
      totalPelanggan,
      formatRupiah,
    }
  },
}
</script>
