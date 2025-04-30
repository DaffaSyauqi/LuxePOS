// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    role: null,
    namaLengkap: 'LuxePoS',
    idUser: null,
    idToko: null,
  }),
  persist: process.env.CLIENT
    ? {
        key: 'userStore',
        storage: window.localStorage,
      }
    : false,
  actions: {
    setRole(newRole) {
      this.role = newRole
    },
    setNamaLengkap(nama) {
      this.namaLengkap = nama
    },
    setUserData({ userId, tokoId }) {
      this.idUser = userId
      this.idToko = tokoId
    },
    resetUser() {
      this.role = null
      this.namaLengkap = 'LuxePoS'
      this.idUser = null
      this.idToko = null
    },
  },
})
