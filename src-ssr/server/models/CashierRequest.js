// models/CashierRequest.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'
import User from './User.js'

const CashierRequest = sequelize.define(
  'CashierRequests',
  {
    id_request: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_toko: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Status: pending, confirmed, atau rejected
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'cashier_requests',
  },
)

// Definisikan relasi: CashierRequest BELONGS TO User
CashierRequest.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user', // alias
})

export default CashierRequest
