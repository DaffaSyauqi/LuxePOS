import express from 'express'
import bcrypt from 'bcrypt'
import User from '../server/models/User.js'
import response from '../response.js'

const router = express.Router()

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      return response(404, null, 'Id not found', res)
    }
    response(200, user, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all users
router.get('/', async (req, res) => {
  try {
    const user = await User.findAll({
      order: [['id_user', 'ASC']],
    })
    response(200, user, 'Get all data from table user', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST new user
router.post('/', async (req, res) => {
  try {
    const { nama_lengkap, email, nomor_telepon, password, role } = req.body
    if (!nama_lengkap || !email || !nomor_telepon || !password || !role) {
      return response(400, null, 'All data must be filled', res)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      nama_lengkap,
      email,
      nomor_telepon,
      password: hashedPassword,
      role,
    })
    response(200, user, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add data', res)
  }
})

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nama_lengkap, email, nomor_telepon, password, role } = req.body
    const user = await User.findByPk(id)
    if (!user) {
      return response(404, null, 'Id not found', res)
    }
    await user.update({
      nama_lengkap,
      email,
      nomor_telepon,
      password: password ? bcrypt.hashSync(password, 10) : user.password,
      role,
    })
    response(200, user, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      return response(404, null, 'Id not found', res)
    }
    await User.destroy({ where: { id_user: id } })
    response(200, user, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
