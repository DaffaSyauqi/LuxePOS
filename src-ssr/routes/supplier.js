import express from 'express'
import Supplier from '../server/models/Supplier.js'
import response from '../response.js'
import verifyToken from '../middlewares/auth.js'

const router = express.Router()

// GET supplier by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await Supplier.findOne({
      where: {
        id_supplier: id,
        id_toko: req.user.id_toko,
      },
    })
    if (!supplier) {
      return response(404, null, 'Id not found', res)
    }
    response(200, supplier, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all supplier
router.get('/', verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findAll({
      order: [['id_supplier', 'ASC']],
    })
    response(200, supplier, 'Get all data from table supplier', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST new supplier
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nama_supplier, alamat, nomor_telepon } = req.body
    if (!nama_supplier || !alamat || !nomor_telepon) {
      return response(400, null, 'All data must be filled', res)
    }
    const supplier = await Supplier.create({
      nama_supplier,
      alamat,
      nomor_telepon,
      created_by: req.user.id_user,
      id_toko: req.user.id_toko,
    })
    response(200, supplier, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add data', res)
  }
})

// PUT update supplier
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { nama_supplier, alamat, nomor_telepon } = req.body

    const supplier = await Supplier.findOne({
      where: {
        id_supplier: id,
        id_toko: req.user.id_toko,
      },
    })
    if (!supplier) {
      return response(404, null, 'Id not found', res)
    }

    await supplier.update({
      nama_supplier,
      alamat,
      nomor_telepon,
    })
    response(200, supplier, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE supplier
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { role, id_toko } = req.user

    let supplier

    if (role === 'superadmin') {
      supplier = await Supplier.findOne({ where: { id_supplier: id } })
    } else {
      supplier = await Supplier.findOne({
        where: {
          id_kategori: id,
          id_toko: id_toko,
        },
      })
    }

    if (!supplier) {
      return response(404, null, 'Id not found', res)
    }

    await Supplier.destroy({ where: { id_supplier: id } })
    response(200, supplier, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
