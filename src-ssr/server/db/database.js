import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dbPassword = process.env.DB_PASSWORD

const sequelize = new Sequelize('luxepos-db', 'postgres', dbPassword, {
  host: 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    useUTC: false, // Gunakan waktu lokal, bukan UTC
  },
  timezone: '+07:00', // Set zona waktu ke WIB
  logging: false,
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database Connected!')
  } catch (error) {
    console.error('❌ Database Connection Failed:', error)
  }
}

export { sequelize, connectDB }
