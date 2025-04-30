import express from 'express'
import Category from '../server/models/Category.js'
import response from '../response.js'
import verifyToken from '../middlewares/auth.js'

const router = express.Router()

// GET category by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findOne({
      where: {
        id_kategori: id,
        id_toko: req.user.id_toko,
      },
    })
    if (!category) {
      return response(404, null, 'Id not found', res)
    }
    response(200, category, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all categories
router.get('/', verifyToken, async (req, res) => {
  try {
    const category = await Category.findAll({
      order: [['id_kategori', 'ASC']],
    })
    response(200, category, 'Get all data from table kategori', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST new category
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nama_kategori } = req.body
    if (!nama_kategori) {
      return response(400, null, 'All data must be filled', res)
    }

    const category = await Category.create({
      nama_kategori,
      created_by: req.user.id_user,
      id_toko: req.user.id_toko,
    })

    response(200, category, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add data', res)
  }
})

// PUT update category
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { nama_kategori } = req.body

    const category = await Category.findOne({
      where: {
        id_kategori: id,
        id_toko: req.user.id_toko,
      },
    })
    if (!category) {
      return response(404, null, 'Id not found', res)
    }

    await category.update({ nama_kategori })
    response(200, category, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE category
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { role, id_toko } = req.user

    let category

    if (role === 'superadmin') {
      category = await Category.findOne({ where: { id_kategori: id } })
    } else {
      category = await Category.findOne({
        where: {
          id_kategori: id,
          id_toko: id_toko,
        },
      })
    }

    if (!category) {
      return response(404, null, 'Id not found', res)
    }

    await Category.destroy({ where: { id_kategori: id } })
    response(200, category, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
