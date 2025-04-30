// server/models/Permission.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Permission = sequelize.define(
  'Permission',
  {
    id_permission: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_permission: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deskripsi_permission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'permission',
    timestamps: false,
  },
)

export default Permission
