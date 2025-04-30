// useLayoutStore.js
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    leftDrawerOpen: true,
  }),
  actions: {
    closeDrawer() {
      this.leftDrawerOpen = false
    },
  },
})
