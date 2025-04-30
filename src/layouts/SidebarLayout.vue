<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="header-toolbar">
        <q-btn
          class="icon"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-space />
        <q-btn-dropdown icon="person" flat>
          <div class="row no-wrap q-pa-md">
            <div class="column items-center">
              <q-avatar size="72px">
                <img src="../assets/icon2.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">{{ fullName }}</div>

              <q-btn color="primary" label="Logout" size="sm" v-close-popup @click="logout" />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer class="sidebar-drawer" v-model="leftDrawerOpen" show-if-above bordered :width="230">
      <q-list>
        <div class="logo-container">
          <img src="../assets/icon2.png" alt="logo" class="logo-img" />
          <q-item-label header class="logo-text">LuxePoS</q-item-label>
        </div>

        <div v-for="link in linksList" :key="link.title">
          <q-expansion-item
            v-if="link.submenu"
            :label="link.title"
            expand-icon="keyboard_arrow_down"
            expand-separator
            class="link-item"
          >
            <q-item
              v-for="subLink in link.submenu"
              :key="subLink.title"
              clickable
              v-ripple
              :class="getActiveClass(subLink.link)"
              @click="navigateTo(subLink.link)"
            >
              <q-item-section avatar>
                <q-icon :name="subLink.icon" />
              </q-item-section>
              <q-item-section>{{ subLink.title }}</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            v-else
            clickable
            v-ripple
            :class="getActiveClass(link.link)"
            @click="navigateTo(link.link)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

const router = useRouter()
const route = useRoute()
// const $q = useQuasar()

const leftDrawerOpen = ref(false)
provide('leftDrawerOpen', leftDrawerOpen)

// Gunakan Pinia store untuk role dan nama lengkap yang reaktif
const userStore = useUserStore()

const userRole = computed(() => userStore.role)
const fullName = computed(() => userStore.namaLengkap || 'John Doe')

// Daftar menu berdasarkan role dari store
const linksList = computed(() => {
  if (userRole.value === 'superadmin') {
    return [
      { title: 'Dashboard', icon: 'home', link: '/superadmin/dashboard' },
      { title: 'POS', icon: 'shopping_cart', link: '/superadmin/pos' },
      { title: 'Riwayat Transaksi', icon: 'summarize', link: '/superadmin/transaction' },
      { title: 'Laporan', icon: 'description', link: '/superadmin/report' },
      { title: 'Supplier', icon: 'local_shipping', link: '/superadmin/supplier' },
      {
        title: 'Inventaris',
        submenu: [
          { title: 'Produk', icon: 'inventory_2', link: '/superadmin/product' },
          { title: 'Kategori', icon: 'list_alt', link: '/superadmin/category' },
        ],
      },
      {
        title: 'User',
        submenu: [
          { title: 'User', icon: 'group', link: '/superadmin/user' },
          { title: 'Role', icon: 'manage_accounts', link: '/superadmin/role' },
          { title: 'Kasir Konfirm', icon: 'person_add_alt', link: '/superadmin/confirm-cashier' },
        ],
      },
      { title: 'Pengaturan', icon: 'settings', link: '/superadmin/setting' },
    ]
  } else if (userRole.value === 'admin') {
    return [
      { title: 'Dashboard', icon: 'home', link: '/admin/dashboard' },
      { title: 'POS', icon: 'shopping_cart', link: '/admin/pos' },
      { title: 'Riwayat Transaksi', icon: 'summarize', link: '/admin/transaction' },
      { title: 'Laporan', icon: 'description', link: '/admin/report' },
      { title: 'Supplier', icon: 'local_shipping', link: '/admin/supplier' },
      {
        title: 'Inventaris',
        submenu: [
          { title: 'Produk', icon: 'inventory_2', link: '/admin/product' },
          { title: 'Kategori', icon: 'list_alt', link: '/admin/category' },
        ],
      },
      {
        title: 'User',
        submenu: [
          { title: 'User', icon: 'group', link: '/admin/user' },
          { title: 'Kasir Konfirm', icon: 'person_add_alt', link: '/admin/confirm-cashier' },
        ],
      },
      { title: 'Pengaturan', icon: 'settings', link: '/admin/setting' },
    ]
  } else if (userRole.value === 'kasir') {
    return [
      { title: 'Dashboard', icon: 'home', link: '/kasir/dashboard' },
      { title: 'POS', icon: 'shopping_cart', link: '/kasir/pos' },
      { title: 'Riwayat Transaksi', icon: 'summarize', link: '/kasir/transaction' },
      { title: 'Pengaturan', icon: 'settings', link: '/kasir/setting' },
    ]
  } else {
    return [{ title: 'Role tidak valid', icon: 'home', link: '/' }]
  }
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function navigateTo(link) {
  if (link) router.push(link)
}

function getActiveClass(link) {
  return {
    'bg-primary text-positive': route.path === link,
    'hover-bg-primary': route.path !== link,
  }
}

async function logout() {
  try {
    await api.post('/logout', {}, { withCredentials: true })
    userStore.resetUser() // Reset state user di store
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message)
  }
}
</script>

<style lang="scss">
/* Tambahkan style jika diperlukan */
</style>
