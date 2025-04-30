import jwt from 'jsonwebtoken'
import config from '../secret.js'

const { secretKey } = config

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' })
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa', error })
  }
}

export default verifyToken
