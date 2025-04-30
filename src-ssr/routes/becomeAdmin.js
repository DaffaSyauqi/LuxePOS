import express from 'express'
import jwt from 'jsonwebtoken'
import verifyToken from '../middlewares/auth.js'
import Store from '../server/models/Store.js'
import User from '../server/models/User.js'
import Role from '../server/models/Role.js'
import response from '../response.js'
import { sequelize } from '../server/db/database.js'
import config from '../secret.js'

const router = express.Router()
const { secretKey } = config

// Fungsi untuk generate kode unik toko
const generateStoreCode = () => {
  return 'TOKO-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

router.post('/', verifyToken, async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const id_user = req.user.id_user
    const { nama_toko, deskripsi_toko, alamat, nomor_telepon } = req.body

    if (!nama_toko || !deskripsi_toko || !alamat || !nomor_telepon) {
      await t.rollback()
      return response(400, null, 'Semua field harus diisi', res)
    }

    // Cari id_role untuk admin
    const adminRole = await Role.findOne({ where: { nama_role: 'admin' }, transaction: t })
    if (!adminRole) {
      await t.rollback()
      return response(500, null, 'Role admin tidak ditemukan', res)
    }

    const kode_toko = generateStoreCode()

    const store = await Store.create(
      {
        nama_toko,
        deskripsi_toko,
        alamat,
        nomor_telepon,
        created_by: id_user,
        kode_toko,
      },
      { transaction: t },
    )

    // Update user: jadi admin dan punya toko
    await User.update(
      {
        role: 'admin',
        id_role: adminRole.id_role,
        id_toko: store.id_toko,
      },
      { where: { id_user }, transaction: t },
    )

    const updatedUser = await User.findOne({ where: { id_user }, transaction: t })

    const newAccessToken = jwt.sign(
      { id_user: updatedUser.id_user, role: updatedUser.role },
      secretKey,
      { expiresIn: '1h' },
    )

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000,
    })

    res.cookie('role', 'admin', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    await t.commit()
    return response(
      200,
      {
        store,
        role: updatedUser.role,
        nama_lengkap: updatedUser.nama_lengkap,
      },
      'Berhasil menjadi admin dan toko berhasil dibuat',
      res,
    )
  } catch (error) {
    await t.rollback()
    console.error(error)
    return response(500, error, 'Terjadi kesalahan pada server', res)
  }
})

export default router
