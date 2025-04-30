// models/Product.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Product = sequelize.define(
  'Produk',
  {
    id_produk: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_produk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlah_produk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    harga_produk: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: true, // gambar opsional
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
    tableName: 'produk',
  },
)

export default Product
