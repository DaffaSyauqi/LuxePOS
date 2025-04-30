import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Store = sequelize.define(
  'Toko',
  {
    id_toko: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_toko: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi_toko: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    kode_toko: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'toko', // Sesuaikan nama table jika diperlukan
  },
)

export default Store
