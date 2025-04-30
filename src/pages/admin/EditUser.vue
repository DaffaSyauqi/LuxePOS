<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit User</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="updateUser">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama</label>
        </div>
        <div class="col-10">
          <q-input v-model="userData.nama_lengkap" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Email</label>
        </div>
        <div class="col-10">
          <q-input v-model="userData.email" type="email" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">No Telepon</label>
        </div>
        <div class="col-10">
          <q-input v-model="userData.nomor_telepon" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Password</label>
        </div>
        <div class="col-10">
          <q-input v-model="userData.password" type="password" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Role</label>
        </div>
        <div class="col-10">
          <q-select v-model="userData.role" :options="options" dense outlined />
        </div>

        <div class="col-2"></div>
        <div class="col-10 row q-gutter-sm">
          <q-btn type="submit" color="primary" text-color="positive" label="Submit" />
          <q-btn to="/superadmin/user" color="secondary" text-color="dark" label="Batal" />
        </div>
      </div>
    </q-form>
  </div>
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

    const userData = ref({
      nama_lengkap: '',
      email: '',
      nomor_telepon: '',
      password: '',
      role: '',
    })

    const options = ref([])

    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${route.params.id}`)
        const data = response.data.payload
        userData.value = {
          nama_lengkap: data.nama_lengkap || '',
          email: data.email || '',
          nomor_telepon: data.nomor_telepon || '',
          password: '',
          role: data.role || '',
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data user',
        })
      }
    }

    const fetchRole = async () => {
      try {
        const response = await api.get('/role')
        if (response.data && response.data.payload) {
          options.value = response.data.payload
            .filter((role) => role.nama_role !== 'superadmin')
            .map((role) => role.nama_role)
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Gagal mengambil data kategori',
          })
        }
      } catch (error) {
        console.error('Error saat mengambil data role:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Terjadi kesalahan, coba lagi nanti',
        })
      }
    }

    const updateUser = async () => {
      try {
        await api.put(`/users/${route.params.id}`, userData.value)
        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: 'User berhasil diperbarui!',
        })
        router.push('/superadmin/user')
      } catch (error) {
        console.error(error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui user',
        })
      }
    }

    onMounted(() => {
      fetchUserData()
      fetchRole()
    })

    return { userData, options, updateUser }
  },
}
</script>
