import express from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import crypto from 'crypto'
import Product from '../server/models/Product.js'
import response from '../response.js'
import verifyToken from '../middlewares/auth.js'

// Gunakan base path dari root project
const uploadDir = path.join(process.cwd(), 'src-ssr/assets/uploads/produk')

// Buat folder upload jika belum ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Fungsi untuk menghapus gambar jika ada
function deleteImageIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  } else {
    console.warn('File gambar tidak ditemukan:', filePath)
  }
}

// Konfigurasi storage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(8).toString('hex')
    const extension = path.extname(file.originalname)
    cb(null, `${randomName}${extension}`)
  },
})

// Filter file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/
  const mimeType = allowedTypes.test(file.mimetype)
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  if (mimeType && extName) {
    return cb(null, true)
  }
  cb(new Error('Error: File harus berupa gambar'))
}

const upload = multer({ storage, fileFilter })
const router = express.Router()

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)
    if (!product) return response(404, null, 'Id not found', res)
    response(200, product, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all product
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['id_produk', 'ASC']],
    })
    response(200, products, 'Get all data from table produk', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST create product
router.post('/', verifyToken, upload.single('gambar'), async (req, res) => {
  try {
    const { nama_produk, jumlah_produk, harga_produk, kategori } = req.body
    if (!nama_produk || !jumlah_produk || !harga_produk || !kategori) {
      return response(400, null, 'All data must be filled', res)
    }

    const created_by = req.user.id_user
    const id_toko = req.user.id_toko
    if (!created_by || !id_toko) {
      return response(400, null, 'Data user tidak lengkap untuk menambahkan produk', res)
    }

    let gambarFilename = null
    if (req.file) {
      gambarFilename = req.file.filename
    }

    const product = await Product.create({
      nama_produk,
      jumlah_produk,
      harga_produk,
      kategori,
      created_by,
      id_toko,
      gambar: gambarFilename,
    })

    response(200, product, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add data', res)
  }
})

// PUT update product
router.put('/:id', verifyToken, upload.single('gambar'), async (req, res) => {
  try {
    const { id } = req.params
    const { nama_produk, jumlah_produk, harga_produk, kategori } = req.body
    const product = await Product.findByPk(id)

    if (!product) return response(404, null, 'Id not found', res)

    // Hapus gambar lama jika ada gambar baru
    if (req.file) {
      if (product.gambar) {
        const oldImagePath = path.join(uploadDir, product.gambar)
        deleteImageIfExists(oldImagePath)
      }
      product.gambar = req.file.filename
    }

    await product.update({
      nama_produk,
      jumlah_produk,
      harga_produk,
      kategori,
      gambar: product.gambar,
    })

    response(200, product, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) return response(404, null, 'Id not found', res)

    if (product.gambar) {
      const imagePath = path.join(uploadDir, product.gambar)
      deleteImageIfExists(imagePath)
    }

    await Product.destroy({ where: { id_produk: id } })
    response(200, product, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
