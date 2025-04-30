// middlewares/checkPermission.js
import { getPermissionsByRoleId } from '../utils/permissionUtils.js'
import User from '../server/models/User.js'
import response from '../response.js'

export default function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id_user)

      if (!user || !user.id_role) {
        return response(403, null, 'User tidak memiliki role yang valid', res)
      }

      const permissions = await getPermissionsByRoleId(user.id_role)

      if (!permissions.includes(requiredPermission)) {
        return response(403, null, 'Akses ditolak, permission tidak tersedia', res)
      }

      next()
    } catch (err) {
      console.error(err)
      return response(500, err, 'Gagal memverifikasi permission', res)
    }
  }
}
