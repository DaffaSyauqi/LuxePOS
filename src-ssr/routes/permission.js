import express from 'express'
import Permission from '../server/models/Permission.js'
import RolePermission from '../server/models/RolePermission.js'
import response from '../response.js'

const router = express.Router()

// 1. GET Semua Permission
router.get('/', async (req, res) => {
  try {
    const permissions = await Permission.findAll()
    return response(200, permissions, 'Semua data permission berhasil diambil', res)
  } catch (error) {
    console.error(error)
    return response(500, error, 'Gagal mengambil data permission', res)
  }
})

// 2. GET Semua Permission + Penanda untuk Role
router.get('/:id_role', async (req, res) => {
  try {
    const { id_role } = req.params

    // Ambil semua permission
    const allPermissions = await Permission.findAll()

    // Ambil permission yang dimiliki role
    const rolePermissions = await RolePermission.findAll({
      where: { id_role },
    })
    const rolePermissionIds = rolePermissions.map((rp) => rp.id_permission)

    // Tandai selected
    const permissionsWithSelection = allPermissions.map((perm) => ({
      id: perm.id,
      nama_permission: perm.nama_permission,
      selected: rolePermissionIds.includes(perm.id),
    }))

    return response(200, permissionsWithSelection, 'Permission untuk role berhasil diambil', res)
  } catch (error) {
    console.error(error)
    return response(500, error, 'Gagal mengambil permission untuk role', res)
  }
})

// 3. PUT / Update Permission untuk Role
router.put('/:id_role', async (req, res) => {
  try {
    const { id_role } = req.params
    const { permissionIds } = req.body // Array of id_permission

    if (!Array.isArray(permissionIds)) {
      return response(400, null, 'permissionIds harus berupa array', res)
    }

    // Hapus semua permission lama
    await RolePermission.destroy({ where: { id_role } })

    // Tambahkan yang baru
    const newPermissions = permissionIds.map((id_permission) => ({
      id_role,
      id_permission,
    }))
    await RolePermission.bulkCreate(newPermissions)

    return response(200, null, 'Permission untuk role berhasil diperbarui', res)
  } catch (error) {
    console.error(error)
    return response(500, error, 'Gagal memperbarui permission', res)
  }
})

export default router
