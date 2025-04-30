// server/models/RolePermission.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'
import Role from './Role.js'
import Permission from './Permission.js'

const RolePermission = sequelize.define(
  'RolePermission',
  {
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id_role',
      },
    },
    id_permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: 'id_permission',
      },
    },
  },
  {
    tableName: 'role_permission',
    timestamps: false,
  },
)

// Association
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'id_role',
  otherKey: 'id_permission',
})

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'id_permission',
  otherKey: 'id_role',
})

export default RolePermission
