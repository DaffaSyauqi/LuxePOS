import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Category = sequelize.define(
  'Kategori',
  {
    id_kategori: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kategori: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: 'kategori',
  },
)

export default Category
