import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Role = sequelize.define(
  'Role',
  {
    id_role: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'role',
  },
)

export default Role
