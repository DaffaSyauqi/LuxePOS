import express from 'express'
import verifyToken from '../middlewares/auth.js'
import CashierRequest from '../server/models/CashierRequest.js'
import Store from '../server/models/Store.js'
import response from '../response.js'

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const id_user = req.user.id_user
    const { kode_toko } = req.body

    // Validasi: kode_toko harus diisi
    if (!kode_toko) {
      return response(400, null, 'Kode toko harus diisi', res)
    }

    // Cari toko berdasarkan kode_toko
    const store = await Store.findOne({ where: { kode_toko } })
    if (!store) {
      return response(404, null, 'Kode toko tidak valid', res)
    }

    // Cek apakah user sudah pernah request sebagai kasir di toko ini
    const existingRequest = await CashierRequest.findOne({
      where: { id_user, id_toko: store.id_toko },
    })

    if (existingRequest) {
      return response(400, null, 'Anda sudah mengajukan request sebagai kasir untuk toko ini', res)
    }

    // Buat request sebagai kasir
    const request = await CashierRequest.create({
      id_user,
      id_toko: store.id_toko,
      status: 'pending',
    })

    response(200, request, 'Request sebagai kasir telah dibuat dan menunggu konfirmasi admin', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Terjadi kesalahan pada server', res)
  }
})

export default router
