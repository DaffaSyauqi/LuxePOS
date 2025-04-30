import express from 'express'
import { Product, Transaction, DetailsTransaction } from '../server/models/index.js'

import { fn, col, literal } from 'sequelize'
import verifyToken from '../middlewares/auth.js'
import response from '../response.js'

const router = express.Router()

const getProdukTerlaris = async (req, res) => {
  const { id_toko } = req.query

  if (!id_toko) {
    return response(404, null, 'Id toko tidak ada', res)
  }

  try {
    const result = await DetailsTransaction.findAll({
      attributes: ['id_produk', [fn('SUM', col('jumlah')), 'total_terjual']],
      include: [
        {
          model: Product,
          where: { id_toko },
          attributes: ['id_produk', 'nama_produk'],
        },
        {
          model: Transaction,
          where: { id_toko },
          attributes: [],
        },
      ],
      group: ['DetailsTransaksi.id_produk', 'Produk.id_produk', 'Produk.nama_produk'],
      order: [[literal('total_terjual'), 'DESC']],
      limit: 10,
    })

    const formatted = result.map((item) => ({
      id_produk: item.id_produk,
      nama_produk: item.Produk.nama_produk,
      total_terjual: parseInt(item.get('total_terjual')),
    }))

    response(200, formatted, 'Produk terlaris berhasil diambil', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Terjadi kesalahan server', res)
  }
}

router.get('/', verifyToken, getProdukTerlaris)

export default router
