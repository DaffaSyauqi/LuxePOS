<template>
  <div class="text-h4 q-pt-xl q-pl-lg">Tambah User</div>

  <div class="q-pt-xl q-pl-lg q-pr-lg">
    <q-form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Nama Lengkap</label>
        </div>
        <div class="col-10">
          <q-input v-model="nama_lengkap" type="text" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Email</label>
        </div>
        <div class="col-10">
          <q-input v-model="email" type="email" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">No Telepon</label>
        </div>
        <div class="col-10">
          <q-input v-model="nomor_telepon" type="text" dense outlined required />
        </div>

        <div class="col-2 custom-label q-pr-md">
          <label class="text-subtitle1 q-mt-sm">Password</label>
        </div>
        <div class="col-10">
          <q-input v-model="password" type="password" dense outlined required />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const nama_lengkap = ref('')
    const email = ref('')
    const nomor_telepon = ref('')
    const password = ref('')

    const submitForm = async () => {
      if (!nama_lengkap.value || !email.value || !nomor_telepon.value || !password.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Semua field harus diisi!',
        })
        return
      }

      try {
        const response = await api.post('/users', {
          nama_lengkap: nama_lengkap.value,
          email: email.value,
          nomor_telepon: nomor_telepon.value,
          password: password.value,
          role: 'pending',
        })

        if (response.status === 200 || response.status === 201) {
          $q.notify({
            position: 'right',
            color: 'green-5',
            textColor: 'white',
            icon: 'check_circle',
            message: 'User berhasil ditambahkan!',
          })
          router.push('/superadmin/user')
        } else {
          $q.notify({
            position: 'right',
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: response.data.message || 'Gagal menambahkan user',
          })
        }
      } catch (error) {
        console.error('Error saat kirim data:', error)
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Terjadi kesalahan, coba lagi nanti',
        })
      }
    }

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
