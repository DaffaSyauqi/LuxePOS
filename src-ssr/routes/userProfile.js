import express from 'express'
import verifyToken from '../middlewares/auth.js'
import response from '../response.js'
import User from '../server/models/User.js'

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    // Misal req.user.id_user sudah tersedia dari middleware verifyToken
    const user = await User.findOne({ where: { id_user: req.user.id_user } })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }
    // Anda bisa mengembalikan data user lengkap, termasuk id_toko
    response(200, user, 'Data profil', res)
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error })
  }
})

export default router
