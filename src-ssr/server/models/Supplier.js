import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Supplier = sequelize.define(
  'Supplier',
  {
    id_supplier: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_supplier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_telepon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_toko: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'supplier',
  },
)

export default Supplier
