import express from 'express'
import refreshTokens from '../tokenStore.js'
import response from '../response.js'

const router = express.Router()

router.post('/', (req, res) => {
  // Ambil refresh token dari cookie
  const token = req.cookies.refreshToken

  if (token) {
    // Hapus token dari array jika ditemukan
    const index = refreshTokens.indexOf(token)
    if (index > -1) {
      refreshTokens.splice(index, 1)
    }
  }

  // Bersihkan cookie yang terkait
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.clearCookie('role')
  res.clearCookie('nama_lengkap')

  response(200, null, 'Logout berhasil', res)
})

export default router
