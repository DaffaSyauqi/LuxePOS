// src/composables/useUser.js
import { ref } from 'vue'

// State global untuk role
export const userRole = ref(null)

// State global untuk nama lengkap (opsional)
export const namaLengkap = ref('John Doe')

// Setter jika ingin ubah role secara manual
export function setUserRole(newRole) {
  userRole.value = newRole
}

// Setter nama lengkap (opsional)
export function setNamaLengkap(newName) {
  namaLengkap.value = newName
}
