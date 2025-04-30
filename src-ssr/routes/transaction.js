// routes/transaction.js
import express from 'express'
import Transaction from '../server/models/Transaction.js'
import DetailsTransaction from '../server/models/DetailsTransaction.js'
import User from '../server/models/User.js'
import Product from '../server/models/Product.js'
import verifyToken from '../middlewares/auth.js'
import response from '../response.js'

const router = express.Router()

// 🔧 Buat invoice otomatis
const generateInvoice = async () => {
  const last = await Transaction.findOne({ order: [['id_transaksi', 'DESC']] })
  const nextId = last ? last.id_transaksi + 1 : 1
  return `INV${nextId.toString().padStart(5, '0')}`
}

// ✅ GET semua transaksi milik toko
router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { id_toko: req.user.id_toko },
      include: [
        {
          model: User,
          as: 'kasir',
          attributes: ['nama_lengkap'],
        },
      ],
      order: [['tanggal', 'DESC']],
    })

    response(200, transactions, 'Get semua transaksi berhasil', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Gagal ambil data transaksi', res)
  }
})

// ✅ GET detail transaksi by ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    const transaction = await Transaction.findOne({
      where: {
        id_transaksi: id,
        id_toko: req.user.id_toko,
      },
      include: [
        {
          model: DetailsTransaction,
          as: 'detail',
        },
        {
          model: User,
          as: 'kasir',
          attributes: ['nama_lengkap'],
        },
      ],
    })

    if (!transaction) {
      return response(404, null, 'Transaksi tidak ditemukan', res)
    }

    response(200, transaction, 'Detail transaksi ditemukan', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Gagal ambil detail transaksi', res)
  }
})

// ✅ POST transaksi baru
router.post('/', verifyToken, async (req, res) => {
  const { total, uang_dibayar, detail } = req.body
  const { id_user, id_toko } = req.user

  try {
    if (!total || !uang_dibayar || !Array.isArray(detail) || detail.length === 0) {
      return response(400, null, 'Semua data harus diisi dan detail tidak boleh kosong', res)
    }

    // 🔍 Validasi uang cukup
    if (uang_dibayar < total) {
      return response(400, null, 'Uang yang dibayar tidak cukup', res)
    }

    // 🔍 Validasi stok untuk semua produk
    for (const item of detail) {
      const product = await Product.findOne({
        where: { id_produk: item.id_produk, id_toko },
      })

      if (!product) {
        return response(404, null, `Produk dengan ID ${item.id_produk} tidak ditemukan`, res)
      }

      if (product.jumlah_produk < item.jumlah) {
        return response(400, null, `Stok untuk ${product.nama_produk} tidak cukup`, res)
      }
    }

    // ✅ Buat transaksi
    const nomor_invoice = await generateInvoice()
    const uang_kembalian = uang_dibayar - total

    const transaction = await Transaction.create({
      nomor_invoice,
      id_user,
      id_toko,
      total,
      uang_dibayar,
      uang_kembalian,
    })

    // 🛒 Simpan detail & kurangi stok
    for (const item of detail) {
      await DetailsTransaction.create({
        id_transaksi: transaction.id_transaksi,
        id_produk: item.id_produk,
        nama_produk: item.nama_produk,
        harga: item.harga,
        jumlah: item.jumlah,
        subtotal: item.subtotal,
      })

      // Kurangi stok produk
      await Product.decrement('jumlah_produk', {
        by: item.jumlah,
        where: { id_produk: item.id_produk, id_toko },
      })
    }

    response(200, transaction, 'Transaksi berhasil disimpan', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Gagal menyimpan transaksi', res)
  }
})

// ✅ DELETE transaksi by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await Transaction.findOne({
      where: {
        id_transaksi: id,
        id_toko: req.user.id_toko,
      },
    })

    if (!transaction) {
      return response(404, null, 'Transaksi tidak ditemukan', res)
    }

    await DetailsTransaction.destroy({ where: { id_transaksi: id } })
    await Transaction.destroy({ where: { id_transaksi: id } })

    response(200, null, 'Transaksi berhasil dihapus', res)
  } catch (error) {
    console.error(error)
    response(500, error, 'Gagal menghapus transaksi', res)
  }
})

export default router
