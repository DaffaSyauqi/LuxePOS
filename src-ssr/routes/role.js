import express from 'express'
import Role from '../server/models/Role.js'
import response from '../response.js'

const router = express.Router()

// GET role by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const role = await Role.findByPk(id)
    if (!role) {
      return response(404, null, 'Id not found', res)
    }
    response(200, role, 'Get data by id', res)
  } catch (error) {
    response(500, error, 'Error get id', res)
  }
})

// GET all role
router.get('/', async (req, res) => {
  try {
    const role = await Role.findAll({
      order: [['id_role', 'ASC']],
    })
    response(200, role, 'Get all data from table role', res)
  } catch (error) {
    response(500, error, 'Error fetching data', res)
  }
})

// POST new role
router.post('/', async (req, res) => {
  try {
    const { nama_role } = req.body
    if (!nama_role) {
      return response(400, null, 'All data must be filled', res)
    }
    const role = await Role.create({
      nama_role,
    })
    response(200, role, 'Add data success', res)
  } catch (error) {
    response(500, error, 'Error add role', res)
  }
})

// PUT update role
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nama_role } = req.body
    const role = await Role.findByPk(id)
    if (!role) {
      return response(404, null, 'Id not found', res)
    }
    await role.update({
      nama_role,
    })
    response(200, role, 'Update data success', res)
  } catch (error) {
    response(500, error, 'Error update data', res)
  }
})

// DELETE role
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const role = await Role.findByPk(id)
    if (!role) {
      return response(404, null, 'Id not found', res)
    }
    await Role.destroy({ where: { id_role: id } })
    response(200, role, 'Delete data success', res)
  } catch (error) {
    response(500, error, 'Error delete data', res)
  }
})

export default router
