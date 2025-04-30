import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'
import Product from './Product.js'

const DetailsTransaction = sequelize.define(
  'DetailsTransaksi',
  {
    id_detail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_transaksi: DataTypes.INTEGER,
    id_produk: DataTypes.INTEGER,
    nama_produk: DataTypes.STRING,
    harga: DataTypes.DECIMAL(12, 2),
    jumlah: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL(12, 2),
  },
  {
    tableName: 'detail_transaksi',
    timestamps: false,
  },
)

DetailsTransaction.belongsTo(Product, { foreignKey: 'id_produk' })

export default DetailsTransaction
