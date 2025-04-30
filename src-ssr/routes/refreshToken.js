import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../secret.js'
import refreshTokens from '../tokenStore.js'
import response from '../response.js' // Import fungsi response

const router = express.Router()
const { secretKey, refreshSecretKey } = config

router.post('/', (req, res) => {
  // Ambil refresh token dari cookie
  const token = req.cookies.refreshToken

  if (!token) {
    return response(401, null, 'Token tidak ditemukan', res)
  }

  // Cek jika token ada dalam daftar refresh tokens yang valid
  if (!refreshTokens.includes(token)) {
    return response(403, null, 'Token tidak valid', res)
  }

  jwt.verify(token, refreshSecretKey, (err, user) => {
    if (err) {
      return response(403, null, 'Token tidak valid', res)
    }

    const newAccessToken = jwt.sign(
      { id_user: user.id_user, id_toko: user.id_toko, role: user.role },
      secretKey,
      {
        expiresIn: '1h',
      },
    )

    // Set cookie baru untuk access token
    res.cookie('accessToken', newAccessToken, {
      // secure: true,
      sameSite: 'Lax',
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 jam
    })

    response(200, newAccessToken, 'Token berhasil diperbarui', res)
  })
})

export default router
