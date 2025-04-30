import Product from './Product.js'
import Transaction from './Transaction.js'
import DetailsTransaction from './DetailsTransaction.js'

// Hubungan relasi
Product.hasMany(DetailsTransaction, { foreignKey: 'id_produk' })
DetailsTransaction.belongsTo(Product, { foreignKey: 'id_produk' })

Transaction.hasMany(DetailsTransaction, { foreignKey: 'id_transaksi' })
DetailsTransaction.belongsTo(Transaction, { foreignKey: 'id_transaksi' })

export { Product, Transaction, DetailsTransaction }
