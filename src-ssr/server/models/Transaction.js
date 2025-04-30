import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'
import User from './User.js'
import DetailsTransaction from './DetailsTransaction.js'

const Transaction = sequelize.define(
  'Transaksi',
  {
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomor_invoice: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id_user: DataTypes.INTEGER,
    id_toko: DataTypes.INTEGER,
    tanggal: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total: DataTypes.DECIMAL(12, 2),
    uang_dibayar: DataTypes.DECIMAL(12, 2),
    uang_kembalian: DataTypes.DECIMAL(12, 2),
  },
  {
    tableName: 'transaksi',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
)

Transaction.belongsTo(User, { foreignKey: 'id_user', as: 'kasir' })
Transaction.hasMany(DetailsTransaction, { foreignKey: 'id_transaksi', as: 'detail' })

export default Transaction
