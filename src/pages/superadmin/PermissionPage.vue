<template>
  <q-form @submit.prevent="submitForm">
    <div class="row">
      <div class="col-6 q-pt-xl q-pl-lg">
        <div class="text-h4">Edit Role</div>
      </div>
    </div>

    <div class="q-pa-lg">
      <q-input v-model="nama_role" type="text" class="q-mb-md" dense outlined />
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

    <!-- Hak akses checkbox -->
    <div class="row q-pt-sm q-pl-lg">
      <div class="col-4" v-for="(column, index) in checkboxColumns" :key="index">
        <div class="col" v-for="permission in column" :key="permission.id">
          <q-checkbox
            v-model="selectedPermissions"
            :val="permission.id"
            :label="permission.nama_permission"
          />
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const id = route.params.id
    const nama_role = ref('')
    const filter = ref('')
    const allPermissions = ref([]) // semua permission dari database
    const selectedPermissions = ref([]) // array of permission IDs

    const fetchPermissions = async () => {
      try {
        const res = await api.get(`/permission/${id}`, { withCredentials: true })
        const permissions = res.data.payload
        allPermissions.value = permissions
        // isi selectedPermissions berdasarkan flag `selected` dari API
        selectedPermissions.value = permissions.filter((p) => p.selected).map((p) => p.id)
      } catch (err) {
        console.error('Gagal mengambil permissions:', err)
      }
    }

    const fetchRole = async () => {
      try {
        const res = await api.get(`/role/${id}`, { withCredentials: true })
        const data = res.data.payload
        nama_role.value = data.nama_role
      } catch (err) {
        console.error('Gagal mengambil data role:', err)
      }
    }

    const submitForm = async () => {
      try {
        await api.put(
          `/role/${id}`,
          {
            nama_role: nama_role.value,
          },
          { withCredentials: true },
        )
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Role berhasil diperbarui!',
        })
        router.push('/superadmin/role')
      } catch (err) {
        console.error('Gagal menyimpan role:', err)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal menyimpan role',
        })
      }
    }

    const filteredPermissions = computed(() => {
      if (!filter.value) return allPermissions.value
      return allPermissions.value.filter((p) =>
        p.nama_permission.toLowerCase().includes(filter.value.toLowerCase()),
      )
    })

    const checkboxColumns = computed(() => {
      const columns = [[], [], []]
      filteredPermissions.value.forEach((perm, i) => {
        columns[i % 3].push(perm)
      })
      return columns
    })

    onMounted(async () => {
      await fetchPermissions()
      await fetchRole()
    })

    return {
      nama_role,
      filter,
      selectedPermissions,
      checkboxColumns,
      submitForm,
    }
  },
}
</script>
