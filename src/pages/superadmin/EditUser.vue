<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Edit User</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama</label>
        </div>
        <div class="col-10">
          <q-input v-model="nama_lengkap" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Email</label>
        </div>
        <div class="col-10">
          <q-input v-model="email" type="email" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">No Telepon</label>
        </div>
        <div class="col-10">
          <q-input v-model="nomor_telepon" type="text" dense outlined />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Password</label>
        </div>
        <div class="col-10">
          <q-input v-model="password" type="password" dense outlined />
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

    const id = route.params.id

    const nama_lengkap = ref('')
    const email = ref('')
    const nomor_telepon = ref('')
    const password = ref('')

    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`, { withCredentials: true })
        const data = response.data.payload
        nama_lengkap.value = data.nama_lengkap
        email.value = data.email
        nomor_telepon.value = data.nomor_telepon
        password.value = ''
      } catch (error) {
        console.error('Gagal mengambil data user', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal mengambil data user',
        })
      }
    }

    const submitForm = async () => {
      if (!nama_lengkap.value || !email.value || !nomor_telepon.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Semua field wajib diisi!',
        })
        return
      }

      try {
        const response = await api.put(
          `/users/${id}`,
          {
            nama_lengkap: nama_lengkap.value,
            email: email.value,
            nomor_telepon: nomor_telepon.value,
            password: password.value,
          },
          { withCredentials: true },
        )
        if (response.status === 200) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'User berhasil diperbarui!',
          })
          router.push('/superadmin/user')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal memperbarui user',
          })
        }
      } catch (error) {
        console.error('Gagal memperbarui user', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Gagal memperbarui user',
        })
      }
    }

    onMounted(async () => {
      fetchUser()
    })
    return {
      nama_lengkap,
      email,
      nomor_telepon,
      password,
      submitForm,
    }
  },
}
</script>
