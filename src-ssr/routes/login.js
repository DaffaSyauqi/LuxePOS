import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../secret.js'
import User from '../server/models/User.js'
import refreshTokens from '../tokenStore.js'
import response from '../response.js'

const router = express.Router()
const { secretKey, refreshSecretKey } = config

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return response(400, null, 'Email salah', res)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return response(400, null, 'Password salah', res)
    }

    const accessToken = jwt.sign(
      { id_user: user.id_user, id_toko: user.id_toko, role: user.role },
      secretKey,
      {
        expiresIn: '1h',
      },
    )
    const refreshToken = jwt.sign(
      { id_user: user.id_user, id_toko: user.id_toko, role: user.role },
      refreshSecretKey,
      { expiresIn: '7d' },
    )

    refreshTokens.push(refreshToken)

    // Set cookie untuk token dan data user
    res.cookie('accessToken', accessToken, {
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000, // 1 jam
    })

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    })

    res.cookie('role', user.role, {
      secure: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.cookie('nama_lengkap', user.nama_lengkap, {
      secure: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Kembalikan data user dalam payload agar frontend dapat meng-update state
    response(200, { role: user.role, nama_lengkap: user.nama_lengkap }, 'Login berhasil', res)
  } catch (error) {
    response(500, error, 'Server error', res)
  }
})

export default router
