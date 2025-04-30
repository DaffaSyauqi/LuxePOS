import express from 'express'
import Store from '../server/models/Store.js'
import response from '../response.js'
import verifyToken from '../middlewares/auth.js'

const router = express.Router()

// Fungsi untuk generate kode unik toko
const generateStoreCode = () => {
  return 'TOKO-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

// GET store by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const store = await Store.findByPk(id)
    if (!store) {
      return response(404, null, 'Id not found', res)
    }
    response(200, store, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all store
router.get('/', async (req, res) => {
  try {
    const store = await Store.findAll({
      order: [['id_toko', 'ASC']],
    })
    response(200, store, 'Get all data from table store', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST new store
router.post('/', verifyToken, async (req, res) => {
  try {
    const id_user = req.user.id_user
    const { nama_toko, deskripsi_toko, alamat, nomor_telepon } = req.body
    if (!nama_toko || !deskripsi_toko || !alamat || !nomor_telepon) {
      return response(400, null, 'All data must be filled', res)
    }
    const kode_toko = generateStoreCode()

    const store = await Store.create({
      nama_toko,
      deskripsi_toko,
      alamat,
      nomor_telepon,
      created_by: id_user,
      kode_toko,
    })
    response(200, store, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add data', res)
  }
})

// PUT update store
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nama_toko, deskripsi_toko, alamat, nomor_telepon } = req.body

    const store = await Store.findByPk(id)
    if (!store) {
      return response(404, null, 'Id not found', res)
    }
    await store.update({
      nama_toko,
      deskripsi_toko,
      alamat,
      nomor_telepon,
    })
    response(200, store, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE store
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const store = await Store.findByPk(id)
    if (!store) {
      return response(404, null, 'Id not found', res)
    }
    await Store.destroy({ where: { id_store: id } })
    response(200, store, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
