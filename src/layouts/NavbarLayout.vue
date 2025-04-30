<template>
  <q-layout view="hhh Lpr fFf">
    <!-- Header -->
    <q-header class="navbar-transparent">
      <q-toolbar class="navbar-transparent q-pa-sm q-pl-lg q-pr-lg">
        <!-- Logo / Brand di kiri -->
        <div class="row items-center">
          <img src="../assets/icon2.png" alt="logo" class="logo-img" />
          <q-item-label header class="logo-text">LuxePoS</q-item-label>
        </div>

        <!-- Menu Utama, Tentang, Kontak di tengah -->
        <q-toolbar-title class="flex justify-center">
          <q-btn
            flat
            label="Utama"
            text-color="dark"
            class="q-ml-sm q-mr-sm"
            @click="navigateTo('#utama')"
          />
          <q-btn
            flat
            label="Tentang"
            text-color="dark"
            class="q-ml-sm q-mr-sm"
            @click="navigateTo('#tentang')"
          />
          <q-btn
            flat
            label="Kontak"
            text-color="dark"
            class="q-ml-sm q-mr-sm"
            @click="navigateTo('#kontak')"
          />
        </q-toolbar-title>

        <!-- Tombol Login & Register di kanan -->
        <div class="row items-center">
          <q-btn color="secondary" text-color="dark" label="Login" @click="navigateTo('/login')" />
          <q-btn color="dark" label="Register" class="q-ml-md" @click="navigateTo('/register')" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Isi Halaman -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'

const router = useRouter()

function navigateTo(path) {
  if (path.startsWith('#')) {
    // Scroll ke element di halaman saat ini
    const el = document.getElementById(path.replace('#', ''))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  } else if (path === '/') {
    // Ke halaman root (landing page) dan scroll setelah mount
    router.push('/').then(() => {
      // Delay scroll supaya router-view sudah render
      nextTick(() => {
        const el = document.getElementById('utama')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      })
    })
  } else {
    router.push(path)
  }
}
</script>

<style scoped></style>
