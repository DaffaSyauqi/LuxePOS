<template>
  <q-page class="q-pa-none">
    <section class="landing-hero" id="utama">
      <div class="overlay">
        <div class="content">
          <h1>Run Your Business Like A Pro And Maximize Profits</h1>
          <p>Optimalkan Penjualan Dan Inventaris Dalam Satu Platform Yang Praktis.</p>
          <q-btn to="/register" label="Bergabung Sekarang" color="dark" class="q-mt-md" />
        </div>
        <img src="/src/assets/frame.png" alt="fitur" class="fitur-image q-mt-lg" />
      </div>
    </section>

    <section class="about-luxepos q-pa-xl" id="tentang">
      <div class="row items-center justify-between q-col-gutter-xl">
        <div class="col-12 col-md-6 text-left">
          <h1 class="section-title q-mb-sm">Apa Itu LuxePOS</h1>
          <p class="section-description q-mb-md">
            LuxePOS adalah sistem Point Of Sales berbasis web yang membantu bisnis Anda mengelola
            inventaris, penjualan, dan laporan secara efisien.
          </p>
          <ul class="fitur-list">
            <li>
              <q-icon name="list" size="lg" class="q-mr-sm" />
              <span class="section-description"
                >Memiliki fitur lengkap yang memudahkan pekerjaan anda</span
              >
            </li>
            <li>
              <q-icon name="schedule" size="lg" class="q-mr-sm" />
              <span class="section-description">Mempersingkat waktu kerja anda</span>
            </li>
            <li>
              <q-icon name="desktop_windows" size="lg" class="q-mr-sm" />
              <span class="section-description">Memiliki tampilan yang user-friendly</span>
            </li>
            <li>
              <q-icon name="attach_money" size="lg" class="q-mr-sm" />
              <span class="section-description">Gratis dan praktis</span>
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-6 relative-position flex justify-end">
          <img src="/src/assets/leaf.png" alt="Leaf" class="leaf-decoration" />
          <img src="/src/assets/shop.png" alt="Shop" class="shop-illustration" />
        </div>
      </div>
    </section>

    <section class="kontak-kami q-pa-xl" id="kontak">
      <div class="text-center q-mb-xl">
        <h1 class="section-title">Kontak Kami</h1>
      </div>
      <div class="row q-col-gutter-xl q-pt-xl justify-center items-start text-center">
        <div class="col-12 col-md-4">
          <q-img src="../assets/logos_google-gmail.png" alt="Email" style="width: 128px" />
        </div>
        <div class="col-12 col-md-4">
          <q-img src="../assets/telpon.png" alt="Email" style="width: 128px" />
        </div>
        <div class="col-12 col-md-4">
          <q-img src="../assets/locate.png" alt="Email" style="width: 96px" />
        </div>
      </div>
      <div class="row q-col-gutter-xl q-pt-xl justify-center items-start text-center">
        <div class="col-12 col-md-4">
          <p class="kontak-text q-mt-md">luxepos@gmail.com</p>
        </div>
        <div class="col-12 col-md-4">
          <p class="kontak-text q-mt-md">022-868392432</p>
        </div>
        <div class="col-12 col-md-4">
          <p class="kontak-text q-mt-md">Jakarta Pusat</p>
        </div>
      </div>
    </section>

    <q-btn
      v-if="showBackToTop"
      round
      icon="keyboard_arrow_up"
      color="dark"
      class="back-to-top"
      @click="scrollToTop"
    />
  </q-page>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const showBackToTop = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // Scroll ke ID berdasarkan hash dari URL (misal: #kontak-kami)
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    nextTick(() => {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  }

  // Observe section terakhir (kontak-kami)
  const observer = new IntersectionObserver(
    ([entry]) => {
      showBackToTop.value = entry.isIntersecting
    },
    { threshold: 0.3 },
  )

  const target = document.querySelector('.kontak-kami')
  if (target) observer.observe(target)
})
</script>
