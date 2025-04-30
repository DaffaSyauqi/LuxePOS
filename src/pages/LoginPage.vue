<template>
  <div class="row justify-center items-center q-pa-xl">
    <q-card class="q-pa-xl" style="width: 400px">
      <div class="text-center">
        <img src="../assets/icon2.png" alt="Logo LuxePOS" class="q-pa-s" width="100" />
        <h4 class="text-primary" style="font-weight: 600">LuxePoS</h4>
        <p style="font-weight: 400">Fast And Efficient Sales Solution.</p>
      </div>
      <h4 style="font-weight: 500" class="text-center">Masuk</h4>
      <q-form @submit.prevent="login">
        <q-input filled v-model="email" label="Email" type="email" class="q-mb-md" />
        <q-input
          filled
          v-model="password"
          label="Kata Sandi"
          :type="isPwd ? 'password' : 'text'"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          color="primary"
          text-color="positive"
          type="submit"
          label="Masuk"
          rounded
          class="full-width q-mb-md"
        />
        <div class="text-center">
          <span>
            Belum Mempunyai Akun?
            <a style="color: blue; text-decoration: none" href="/register">Daftar</a>
          </span>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const email = ref('')
    const password = ref('')

    const isPwd = ref(true)

    const userStore = useUserStore()

    const login = async () => {
      try {
        const response = await api.post(
          '/login',
          {
            email: email.value,
            password: password.value,
          },
          { withCredentials: true },
        )

        const data = response.data.payload

        userStore.setRole(data.role)
        userStore.setNamaLengkap(data.nama_lengkap)

        if (data.role === 'superadmin') {
          router.push('/superadmin/dashboard')
        } else if (data.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (data.role === 'kasir') {
          router.push('/kasir/dashboard')
        } else {
          router.push('/choose-role')
        }

        $q.notify({
          position: 'right',
          color: 'green-5',
          textColor: 'white',
          icon: 'check_circle',
          message: `Selamat datang, ${data.nama_lengkap}!`,
        })
      } catch (error) {
        $q.notify({
          position: 'right',
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: error.response?.data?.message || 'Username atau password salah!',
        })
      }
    }

    return {
      email,
      password,
      isPwd,
      login,
    }
  },
}
</script>

<style>
/* Style tambahan jika diperlukan */
</style>
