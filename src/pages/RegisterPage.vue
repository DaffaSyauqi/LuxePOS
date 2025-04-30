<template>
  <div class="row justify-center items-center q-pa-xl">
    <q-card class="q-pa-xl" style="width: 400px">
      <div class="text-center">
        <img src="../assets/icon2.png" alt="Logo LuxePOS" class="q-pa-s" width="100" />
        <h4 class="text-primary" style="font-weight: 600">LuxePoS</h4>
        <p style="font-weight: 400">Fast And Efficient Sales Solution.</p>
      </div>
      <h4 style="font-weight: 500" class="text-center">Daftar</h4>
      <q-form @submit.prevent="registerUser">
        <q-input filled v-model="nama_lengkap" label="Nama Lengkap" class="q-mb-md" />
        <q-input filled v-model="email" label="Email" type="email" class="q-mb-md" />
        <q-input
          filled
          v-model="nomor_telepon"
          label="No. Handphone"
          type="number"
          class="q-mb-md"
        />
        <q-input
          filled
          v-model="password"
          label="Kata Sandi"
          :type="isPwd1 ? 'password' : 'text'"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd1 ? 'visibility_off' : 'visibility'"
              @click="isPwd1 = !isPwd1"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
          filled
          v-model="confirmPassword"
          label="Konfirmasi Kata Sandi"
          :type="isPwd2 ? 'password' : 'text'"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              @click="isPwd2 = !isPwd2"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-btn
          color="primary"
          text-color="white"
          type="submit"
          label="Daftar"
          rounded
          class="full-width q-mb-md"
          :loading="loading"
        />
        <div class="text-center">
          <span>
            Sudah Mempunyai Akun?
            <a style="color: blue; text-decoration: none" href="/login">Masuk</a>
          </span>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default {
  name: 'RegisterPage',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const nama_lengkap = ref('')
    const email = ref('')
    const nomor_telepon = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const isPwd1 = ref(true)
    const isPwd2 = ref(true)

    const registerUser = async () => {
      if (password.value !== confirmPassword.value) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Kata sandi dan konfirmasi tidak cocok!',
        })
        return
      }

      loading.value = true

      try {
        const payload = {
          nama_lengkap: nama_lengkap.value,
          email: email.value,
          nomor_telepon: nomor_telepon.value,
          password: password.value,
          role: 'pending',
        }

        const response = await api.post('/register', payload, { withCredentials: true })

        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: response.data.message || 'Registrasi berhasil!',
        })
        router.push('/login')
      } catch (error) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: error.response?.data?.message || 'Registrasi gagal',
        })
      } finally {
        loading.value = false
      }
    }

    return {
      nama_lengkap,
      email,
      nomor_telepon,
      password,
      confirmPassword,
      loading,
      isPwd1,
      isPwd2,
      registerUser,
    }
  },
}
</script>

<style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>
