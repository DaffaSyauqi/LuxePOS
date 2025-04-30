import express from 'express'
import bcrypt from 'bcrypt'
import User from '../server/models/User.js'
import Role from '../server/models/Role.js'
import response from '../response.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { nama_lengkap, email, nomor_telepon, password } = req.body
    if (!nama_lengkap || !email || !nomor_telepon || !password) {
      return response(400, null, 'Semua data harus diisi', res)
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return response(400, null, 'Email sudah terdaftar', res)
    }

    // Cari role 'pending'
    const pendingRole = await Role.findOne({ where: { nama_role: 'pending' } })
    if (!pendingRole) {
      return response(500, null, 'Role default (pending) tidak ditemukan', res)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      nama_lengkap,
      email,
      nomor_telepon,
      password: hashedPassword,
      id_role: pendingRole.id_role,
      role: pendingRole.nama_role, // Simpan nama role juga
    })

    response(200, user, 'Register berhasil', res)
  } catch (error) {
    response(500, error, 'Register gagal', res)
  }
})

export default router
