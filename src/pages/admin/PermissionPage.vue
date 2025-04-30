<template>
  <q-form @submit.prevent="updateRole">
    <div class="row">
      <div class="col-6 q-pt-xl q-pl-lg">
        <div class="text-h4">Edit Role</div>
      </div>
    </div>
    <div class="q-pa-lg">
      <q-input v-model="roleData.nama_role" type="text" class="q-mb-md" dense outlined />
    </div>

    <div class="text-h4 q-pt-sm q-pl-lg">Hak Akses</div>
    <div class="q-pa-lg">
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
    </div>

    <!-- Hak akses, diletakkan dalam grid tiga kolom -->
    <div class="row q-pt-sm q-pl-lg">
      <div class="col-4">
        <div class="col">
          <q-checkbox v-model="rights.webAccess" label="Akses Aplikasi Web" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.approvePurchase" label="Menyetujui Pembelian" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.approveStockAdjustment" label="Menyetujui Pencacatan Stok" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.printLabel" label="Dapat Mencetak Label" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.printSales" label="Dapat Mencetak Jualan" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createCategory" label="Membuat Kategori" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createUser" label="Membuat User" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createProduct" label="Membuat Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createProductStock" label="Membuat Stok Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createRole" label="Membuat Role" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createSupplier" label="Membuat Supplier" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createTable" label="Membuat Table" />
        </div>
      </div>

      <div class="col-4">
        <div class="col">
          <q-checkbox v-model="rights.deleteCategory" label="Menghapus Kategori" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.deleteProduct" label="Menghapus Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.deleteProductStock" label="Menghapus Stok Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.deleteUser" label="Menghapus User" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.deleteRole" label="Menghapus Role" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.deleteSupplier" label="Menghapus Supplier" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createCashierReport" label="Membuat Laporan Kasir" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createProductReport" label="Membuat Laporan Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.createSalesReport" label="Membuat Laporan Penjualan" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.importProduct" label="Impor Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readAbout" label="Membaca Tentang" />
        </div>
      </div>

      <div class="col-4">
        <div class="col">
          <q-checkbox v-model="rights.readCategory" label="Membaca Kategori" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readPermissions" label="Membaca Perizinan" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readProduct" label="Membaca Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readProductStock" label="Membaca Stok Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readTransactionHistory" label="Membaca Riwayat Transaksi" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readUser" label="Membaca User" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readRole" label="Membaca Role" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readSales" label="Membaca Penjualan" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readSupplier" label="Membaca Supplier" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.readTable" label="Membaca Table" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateAbout" label="Memperbarui Tentang" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateCategory" label="Memperbarui Kategori" />
        </div>
      </div>
    </div>

    <div class="row q-pt-lg q-pl-lg">
      <div class="col-12">
        <div class="col">
          <q-checkbox v-model="rights.updateProduct" label="Memperbarui Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateProductStock" label="Memperbarui Stok Produk" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateSales" label="Memperbarui Penjualan" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.printLabel" label="Dapat Mencetak Label" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateUser" label="Memperbarui User" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateRole" label="Memperbarui Role" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateSupplier" label="Memperbarui Supplier" />
        </div>
        <div class="col">
          <q-checkbox v-model="rights.updateTable" label="Memperbarui Table" />
        </div>
      </div>
    </div>

    <div class="custom-gap q-pl-xl q-pa-lg">
      <q-btn type="submit" color="primary" text-color="positive" label="Simpan Perubahan" />
      <q-btn to="/superadmin/role" color="secondary" text-color="dark" label="Batal" />
    </div>
  </q-form>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const roleData = ref({
      nama_role: '',
    })

    const rights = ref({
      webAccess: false,
      approvePurchase: false,
      approveStockAdjustment: false,
      printLabel: false,
      printSales: false,
      createCategory: false,
      createUser: false,
      createProduct: false,
      createProductStock: false,
      createRole: false,
      createSupplier: false,
      createTable: false,
      deleteCategory: false,
      deleteProduct: false,
      deleteProductStock: false,
      deleteUser: false,
      deleteRole: false,
      deleteSupplier: false,
      createCashierReport: false,
      createProductReport: false,
      createSalesReport: false,
      importProduct: false,
      readAbout: false,
      readCategory: false,
      readPermissions: false,
      readProduct: false,
      readProductStock: false,
      readTransactionHistory: false,
      readUser: false,
      readRole: false,
      readSales: false,
      readSupplier: false,
      readTable: false,
      updateAbout: false,
      updateCategory: false,
      updateProduct: false,
      updateProductStock: false,
      updateSales: false,
      updateUser: false,
      updateRole: false,
      updateSupplier: false,
      updateTable: false,
    })

    const fetchRoleData = async () => {
      try {
        const response = await api.get(`/role/${route.params.id}`)
        const data = response.data.payload
        roleData.value = {
          nama_role: data.nama_role || '',
        }

        // Jika API mengembalikan hak akses sebagai objek, set nilai rights
        // if (data.rights) {
        //   rights.value = data.rights
        // }
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data role',
        })
      }
    }

    const updateRole = async () => {
      try {
        const payload = {
          ...roleData.value,
          // rights: rights.value,
        }
        await api.put(`/role/${route.params.id}`, payload)
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Role berhasil diperbarui!',
        })
        router.push('/superadmin/role')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui role',
        })
      }
    }

    onMounted(() => {
      fetchRoleData()
    })

    return { roleData, rights, updateRole }
  },
}
</script>
