import express from 'express'
import verifyToken from '../middlewares/auth.js'
import CashierRequest from '../server/models/CashierRequest.js'
import User from '../server/models/User.js'
import Role from '../server/models/Role.js'
import response from '../response.js'

const router = express.Router()

// Endpoint GET untuk mengambil request kasir pending
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return response(403, null, 'Akses ditolak, hanya admin yang dapat melihat request kasir', res)
    }

    const adminUser = await User.findOne({ where: { id_user: req.user.id_user } })
    if (!adminUser || !adminUser.id_toko) {
      return response(404, null, 'Admin tidak memiliki toko atau data admin tidak ditemukan', res)
    }

    const pendingRequests = await CashierRequest.findAll({
      where: {
        id_toko: adminUser.id_toko,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id_user', 'nama_lengkap'],
        },
      ],
    })

    return response(200, pendingRequests, 'Data request kasir pending berhasil diambil', res)
  } catch (error) {
    console.error(error)
    return response(500, error, 'Terjadi kesalahan pada server', res)
  }
})

// Endpoint POST untuk mengkonfirmasi request kasir
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return response(
        403,
        null,
        'Akses ditolak, hanya admin yang dapat mengkonfirmasi request kasir',
        res,
      )
    }

    const { id_request } = req.body
    if (!id_request) {
      return response(400, null, 'id_request harus disertakan', res)
    }

    const cashierRequest = await CashierRequest.findOne({
      where: { id_request, status: 'pending' },
    })

    if (!cashierRequest) {
      return response(404, null, 'Request tidak ditemukan atau sudah dikonfirmasi', res)
    }

    const adminUser = await User.findOne({ where: { id_user: req.user.id_user } })
    if (adminUser.id_toko !== cashierRequest.id_toko) {
      return response(
        403,
        null,
        'Anda tidak memiliki hak untuk mengkonfirmasi request pada toko ini',
        res,
      )
    }

    // Cari id_role untuk kasir
    const kasirRole = await Role.findOne({ where: { nama_role: 'kasir' } })
    if (!kasirRole) {
      return response(500, null, 'Role kasir tidak ditemukan', res)
    }

    await CashierRequest.update({ status: 'confirmed' }, { where: { id_request } })

    await User.update(
      {
        role: 'kasir',
        id_role: kasirRole.id_role,
        id_toko: cashierRequest.id_toko,
      },
      { where: { id_user: cashierRequest.id_user } },
    )

    return response(200, null, 'Request kasir berhasil dikonfirmasi, user telah menjadi kasir', res)
  } catch (error) {
    console.error(error)
    return response(500, error, 'Terjadi kesalahan pada server', res)
  }
})

export default router
