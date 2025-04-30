<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Bagian Produk -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <q-input
              class="q-input-rounded"
              outlined
              rounded
              dense
              debounce="300"
              v-model="search"
              placeholder="Search"
              style="max-width: 300px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm q-mb-md">
              <q-btn :style="buttonStyle('all')" label="Semua" @click="filterCategory('all')" />
              <q-btn
                v-for="cat in categories"
                :key="cat.id_kategori"
                :style="buttonStyle(cat.nama_kategori.toLowerCase())"
                :label="cat.nama_kategori"
                @click="filterCategory(cat.nama_kategori.toLowerCase())"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div
                v-for="item in filteredMenu"
                :key="item.id_produk"
                class="col-6 col-sm-4 col-md-3"
              >
                <q-card @click="addToCart(item)" class="small-card">
                  <q-img
                    :src="`/assets/uploads/produk/${item.gambar}`"
                    alt="gambar"
                    style="height: 150px; object-fit: cover"
                  />
                  <q-card-section>
                    <div class="text-subtitle1">{{ item.nama_produk }}</div>
                    <div class="text-caption">{{ formatCurrency(item.harga_produk) }}</div>
                    <div class="text-caption">Stok: {{ item.jumlah_produk }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bagian Cart -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h6">Cart</div>
              </div>
              <div class="col text-right">
                <div class="text-subtitle1">#00001</div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-list bordered>
              <q-item v-for="item in cart" :key="item.id">
                <q-item-section>
                  <q-img :src="item.image" style="width: 90%" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ formatCurrency(item.price) }}</q-item-label>
                  <div class="row items-center">
                    <q-btn flat dense icon="remove" @click="decreaseQuantity(item.id)" />
                    <span class="q-mx-sm">{{ item.quantity }}</span>
                    <q-btn flat dense icon="add" @click="increaseQuantity(item)" />
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    dense
                    color="warning"
                    icon="delete"
                    @click="removeFromCart(item.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions>
            <q-btn
              color="primary"
              text-color="positive"
              style="width: 100%"
              icon="percent"
              label="Promo & Diskon"
            />
          </q-card-actions>

          <q-card-section>
            <div class="row">
              <div class="col-6">Subtotal</div>
              <div class="col-6 text-right">{{ formatCurrency(subtotal) }}</div>
              <div class="col-6">Pajak</div>
              <div class="col-6 text-right">{{ formatCurrency(tax) }}</div>
            </div>

            <div class="q-mt-sm q-mb-sm">
              <hr style="border: 1px dashed #ccc" />
            </div>

            <div class="row">
              <div class="col-6 text-bold">Total</div>
              <div class="col-6 text-right text-bold">{{ formatCurrency(total) }}</div>
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              color="primary"
              text-color="positive"
              style="width: 100%"
              icon="attach_money"
              label="Konfirmasi Pembayaran"
              @click="showPaymentDialog = true"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Dialog Pembayaran -->
    <q-dialog v-model="showPaymentDialog">
      <q-card class="q-pa-md" style="width: 100%; max-width: 400px">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Metode Pembayaran</div>
          <q-btn flat dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">Cash</div>
          <div class="q-gutter-sm">
            <q-btn label="Rp 20.000" outline @click="setCash(20000)" />
            <q-btn label="Rp 50.000" outline @click="setCash(50000)" />
            <q-btn label="Rp 100.000" outline @click="setCash(100000)" />
          </div>

          <q-input
            v-model="customCash"
            class="q-mt-sm"
            outlined
            dense
            type="number"
            label="Jumlah Uang"
          />

          <div class="text-subtitle1 q-mt-md">E-Wallet</div>
          <div class="q-gutter-sm">
            <q-btn label="GOPAY" outline />
            <q-btn label="OVO" outline />
            <q-btn label="DANA" outline />
            <q-btn label="LINKAJA" outline />
            <q-btn label="SHOPEEPAY" outline />
          </div>

          <div class="text-subtitle1 q-mt-md">Other</div>
          <div class="q-gutter-sm">
            <q-btn label="BCA QR" outline />
            <q-btn label="Bank Transfer" outline />
            <q-btn label="QRIS" outline />
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn class="full-width" label="Bayar" color="primary" @click="submitTransaction" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Sukses -->
    <q-dialog v-model="showSuccessDialog">
      <q-card class="q-pa-md" style="width: 100%; max-width: 300px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" size="100px" color="green" />
          <div class="text-h6 q-mt-md">Cash</div>
          <div class="text-subtitle1">Total Harga</div>
          <div class="text-h6 text-weight-bold">{{ formatCurrency(finalTotal) }}</div>
        </q-card-section>

        <q-card-actions align="center" class="q-mt-md">
          <q-btn
            label="Cetak Faktur"
            color="primary"
            @click="printInvoice"
            class="full-width q-mb-md"
          />
          <q-btn label="Transaksi Baru" outline class="full-width" @click="handleNewTransaction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  setup() {
    const $q = useQuasar()
    const leftDrawerOpen = inject('leftDrawerOpen')
    const showPaymentDialog = ref(false)
    const showSuccessDialog = ref(false)
    const customCash = ref('')
    const search = ref('')
    const selectedCategory = ref('all')
    const cart = ref([])
    const menu = ref([])
    const categories = ref([])
    const idToko = ref(null)
    const finalTotal = ref(0)
    const nomor_invoice = ref('')

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

    const fetchCategory = async () => {
      try {
        const response = await api.get('/category', { withCredentials: true })

        if (response.data && Array.isArray(response.data.payload)) {
          categories.value = response.data.payload.filter((p) => p.id_toko === idToko.value)
        } else {
          console.error('Data kategori tidak valid:', response.data)
        }
      } catch (error) {
        console.error('Gagal mengambil kategori:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data kategori',
        })
      }
    }

    const fetchMenu = async () => {
      try {
        const response = await api.get('/product', { withCredentials: true })
        if (response.data && Array.isArray(response.data.payload)) {
          menu.value = response.data.payload.filter((item) => item.id_toko === idToko.value)
        }
      } catch (error) {
        console.error('Gagal mengambil menu:', error)
      }
    }

    onMounted(async () => {
      if (leftDrawerOpen) {
        leftDrawerOpen.value = false
      }
      await fetchUserProfile()
      await fetchCategory()
      await fetchMenu()
    })

    const filteredMenu = computed(() => {
      return menu.value.filter((item) => {
        const matchCategory =
          selectedCategory.value === 'all' ||
          (item.kategori && item.kategori.toLowerCase() === selectedCategory.value.toLowerCase())
        const matchSearch =
          search.value === '' ||
          (item.nama_produk && item.nama_produk.toLowerCase().includes(search.value.toLowerCase()))
        return matchCategory && matchSearch
      })
    })

    const subtotal = computed(() =>
      cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
    )
    const tax = computed(() => subtotal.value * 0)
    const total = computed(() => subtotal.value + tax.value)

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    }

    const today = new Date()
    const formattedDate = today.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const addToCart = (item) => {
      const existingItem = cart.value.find((i) => i.id === item.id_produk)

      if (existingItem) {
        // Gunakan stok dari existingItem untuk akurasi
        if (existingItem.quantity < existingItem.stok) {
          existingItem.quantity++
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Stok tidak mencukupi!',
          })
        }
      } else {
        // Cegah jika stok = 0
        if (item.jumlah_produk <= 0) {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Stok produk habis!',
          })
          return
        }

        cart.value.push({
          id: item.id_produk,
          name: item.nama_produk,
          price: parseFloat(item.harga_produk),
          image: `/assets/uploads/produk/${item.gambar}`,
          quantity: 1,
          stok: parseInt(item.jumlah_produk), // pastikan integer
        })
      }
    }

    const increaseQuantity = (item) => {
      if (parseInt(item.quantity) < parseInt(item.stok)) {
        item.quantity++
      } else {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Stok tidak mencukupi!',
        })
      }
    }

    const decreaseQuantity = (id) => {
      const item = cart.value.find((item) => item.id === id)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          removeFromCart(id)
        }
      }
    }

    const removeFromCart = (id) => {
      cart.value = cart.value.filter((item) => item.id !== id)
    }

    const filterCategory = (category) => {
      selectedCategory.value = category
    }

    const buttonStyle = (category) => {
      return {
        backgroundColor: selectedCategory.value === category ? '#0274f3' : '#d9d9d9',
        color: selectedCategory.value === category ? 'white' : 'black',
      }
    }

    const setCash = (amount) => {
      customCash.value = amount
    }

    const submitTransaction = async () => {
      const cash = parseFloat(customCash.value)

      if (cash < total.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Uang tidak mencukupi!',
        })
        return
      }

      const payload = {
        total: total.value,
        uang_dibayar: cash,
        detail: cart.value.map((item) => ({
          id_produk: item.id,
          nama_produk: item.name,
          harga: item.price,
          jumlah: item.quantity,
          subtotal: item.price * item.quantity,
        })),
      }

      try {
        const res = await api.post('/transaction', payload, { withCredentials: true })

        // pastikan hanya lanjut kalau respons berhasil
        if (res.status === 200) {
          // Ambil nomor invoice dari response
          const invoiceNumber = res.data.payload.nomor_invoice

          nomor_invoice.value = invoiceNumber

          showPaymentDialog.value = false

          finalTotal.value = total.value

          setTimeout(() => {
            showSuccessDialog.value = true
          }, 300)
        } else {
          // tangani kegagalan dari server
          throw new Error(res.data?.message || 'Gagal menyimpan transaksi')
        }
      } catch (error) {
        console.error('Gagal menyimpan transaksi:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal menyimpan transaksi',
        })
      }
    }

    const handleNewTransaction = () => {
      showSuccessDialog.value = false
      cart.value = []
      customCash.value = ''
      fetchMenu() // refresh stok produk
    }

    const printInvoice = async () => {
      const doc = new jsPDF()

      doc.setFontSize(12)
      doc.text('FAKTUR PEMBELIAN', 105, 36, { align: 'center' })

      const invoiceNumber = nomor_invoice.value

      // ==== Info faktur ====
      doc.setFontSize(10)
      doc.text(`No Invoice: ${invoiceNumber}`, 14, 45)
      doc.text(`Tanggal: ${formattedDate}`, 14, 50)

      // ==== Table Produk ====
      const tableColumn = ['Nama Produk', 'Harga', 'Qty', 'Subtotal']
      const tableRows = []

      cart.value.forEach((item) => {
        const itemData = [
          item.name,
          formatCurrency(item.price),
          item.quantity,
          formatCurrency(item.price * item.quantity),
        ]
        tableRows.push(itemData)
      })

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        styles: { fontSize: 10 },
      })

      const finalY = doc.lastAutoTable.finalY || 70

      // ==== Garis pembatas ====
      doc.line(14, finalY + 5, 195, finalY + 5)

      // ==== Totalan ====
      doc.setFontSize(11)
      doc.text(`Total: ${formatCurrency(finalTotal.value)}`, 195, finalY + 15, { align: 'right' })
      doc.text(`Uang Dibayar: ${formatCurrency(parseFloat(customCash.value))}`, 195, finalY + 25, {
        align: 'right',
      })
      doc.text(
        `Kembalian: ${formatCurrency(parseFloat(customCash.value) - finalTotal.value)}`,
        195,
        finalY + 35,
        { align: 'right' },
      )

      // ==== Terima kasih ====
      doc.setFontSize(12)
      doc.text('Terima kasih telah berbelanja!', 105, finalY + 55, { align: 'center' })

      // ==== Save PDF ====
      doc.save(`Faktur-${invoiceNumber}.pdf`)

      showSuccessDialog.value = false
      cart.value = []
      customCash.value = ''
      fetchMenu()
    }

    return {
      showPaymentDialog,
      showSuccessDialog,
      customCash,
      search,
      selectedCategory,
      cart,
      menu,
      categories,
      idToko,
      formatCurrency,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      filterCategory,
      buttonStyle,
      submitTransaction,
      filteredMenu,
      subtotal,
      tax,
      total,
      setCash,
      handleNewTransaction,
      finalTotal,
      printInvoice,
    }
  },
}
</script>
