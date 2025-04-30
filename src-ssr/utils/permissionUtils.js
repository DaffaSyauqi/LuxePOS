// utils/permissionUtils.js
import Role from '../server/models/Role.js'
import Permission from '../server/models/Permission.js'

export async function getPermissionsByRoleId(id_role) {
  const role = await Role.findByPk(id_role, {
    include: {
      model: Permission,
      through: { attributes: [] }, // jangan tampilkan RolePermission
    },
  })

  if (!role) return []

  // Ambil hanya nama_permission-nya
  return role.Permissions.map((p) => p.nama_permission)
}
