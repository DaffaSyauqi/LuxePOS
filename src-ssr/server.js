/**
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
 * Runs in Node context.
 */

/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import {
  defineSsrCreate,
  defineSsrListen,
  defineSsrClose,
  defineSsrServeStaticContent,
  defineSsrRenderPreloadTag,
} from '#q-app/wrappers'

import { connectDB } from './server/db/database.js'

import loginRoutes from './routes/login.js'
import logoutRoutes from './routes/logout.js'
import registerRoutes from './routes/register.js'

import refreshTokenRoutes from './routes/refreshToken.js'
import permissionRoutes from './routes/permission.js'

import becomeAdminRoutes from './routes/becomeAdmin.js'
import requestCashierRoutes from './routes/requestCashier.js'
import confirmCashierRoutes from './routes/confirmCashier.js'

import productRoutes from './routes/product.js'
import productBestsellerRoutes from './routes/productBestseller.js'
import categoryRoutes from './routes/category.js'
import userRoutes from './routes/users.js'
import roleRoutes from './routes/role.js'
import supplierRoutes from './routes/supplier.js'
import storeRoutes from './routes/store.js'
import profileRoutes from './routes/userProfile.js'
import transactionRoutes from './routes/transaction.js'

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Can be async: defineSsrCreate(async ({ ... }) => { ... })
 */
export const create = defineSsrCreate((/* { ... } */) => {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/assets', express.static(path.resolve('src-ssr/assets')))

  dotenv.config()

  connectDB()

  // attackers can use this header to detect apps running Express
  // and then launch specifically-targeted attacks
  app.disable('x-powered-by')

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression())
  }

  app.use('/api/login', loginRoutes)
  app.use('/api/logout', logoutRoutes)
  app.use('/api/register', registerRoutes)

  app.use('/api/refresh-token', refreshTokenRoutes)
  app.use('/api/permission', permissionRoutes)

  app.use('/api/become-admin', becomeAdminRoutes)
  app.use('/api/request-cashier', requestCashierRoutes)
  app.use('/api/confirm-cashier', confirmCashierRoutes)

  app.use('/api/product', productRoutes)
  app.use('/api/product-bestseller', productBestsellerRoutes)
  app.use('/api/category', categoryRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/role', roleRoutes)
  app.use('/api/supplier', supplierRoutes)
  app.use('/api/store', storeRoutes)
  app.use('/api/profile', profileRoutes)
  app.use('/api/transaction', transactionRoutes)

  return app
})

/**
 * You need to make the server listen to the indicated port
 * and return the listening instance or whatever you need to
 * close the server with.
 *
 * The "listenResult" param for the "close()" definition below
 * is what you return here.
 *
 * For production, you can instead export your
 * handler for serverless use or whatever else fits your needs.
 *
 * Can be async: defineSsrListen(async ({ app, devHttpsApp, port }) => { ... })
 */
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => {
  return listenResult.close()
})

const maxAge = process.env.DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(({ app, resolve }) => {
  return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
    const serveFn = express.static(resolve.public(pathToServe), { maxAge, ...opts })
    app.use(resolve.urlPath(urlPath), serveFn)
  }
})

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag((file /* , { ssrContext } */) => {
  if (jsRE.test(file) === true) {
    return `<link rel="modulepreload" href="${file}" crossorigin>`
  }

  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}" crossorigin>`
  }

  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  }

  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  }

  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
  }

  if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
  }

  if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
  }

  return ''
})
