import express from 'express'
import bunyan from 'bunyan'
import multer from 'multer'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

import connectToDB from './db'
import createAPI from './api'
import createViews from './views'
import createPages from './pages'

const setContext = (
  server: express.Application,
  context: RequestContext
): express.Application =>
  server.use((req, _, next) => {
    req.context = context

    return next()
  })

const addPreware = (
  server: express.Application,
  preware: Array<() => express.Handler>
): void => {
  for (const fn of preware) {
    server.use(fn())
  }
}

const addPostware = (
  server: express.Application,
  postware: Array<() => express.Handler>
): void => {
  for (const fn of postware) {
    server.use(fn())
  }
}

/**
 * Default Error Handler
 *
 * @param {Error} err - The Error that bubbled up
 * @param {express.Request} req - The Request
 * @param {express.Response} res - The Response
 * @param {express.NextFunction} next - Calls to next
 */
const defaultErrorHandler: express.ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const { error = err, status = 500 } = res.locals

  req.context.log.error({ err: error })

  res.status(error.status || status).json({
    error: {
      message: err.message
    }
  })
}

const defaultSuccessHandler: express.RequestHandler = (_, res) => {
  const { data, error, status = 200, meta, links } = res.locals

  res.status(status).json({
    data,
    error,
    meta,
    links
  })
}

export const createServer = (config: ServerConfig) => {
  const log = bunyan.createLogger({
    name: config.serviceName,
    level: config.logLevel || 'trace',
    serializers: bunyan.stdSerializers
  })

  const db = connectToDB(config.db)
  const uploads = multer()

  const api = createAPI(config.domains, uploads)

  const context = {
    log,
    db
  }

  // Create Server by adding Context to it
  const server = setContext(express(), context)

  /**
   * PRE MIDDLEWARE
   */
  // Add all preware with our specific ones first
  addPreware(server, [
    () => morgan('dev'),
    cors,
    helmet,
    ...(config.preware || [])
  ])

  /**
   * STATIC FILES
   */

  if (config.staticDir) {
    server.use(
      express.static(config.staticDir, {
        extensions: ['html']
      })
    )
  }
  /**
   * CRUD API
   */
  server.use(config.apiPrefix || '/api', api)

  // Add any postware to our handlers

  /**
   * CRUD VIEWS
   */
  createViews(server, config.domains, config.templateDir, config.tempalteType)

  /**
   * PAGES
   */
  server.use(createPages(config.pages || {}))

  /**
   * POST MIDDLEWARE
   */
  addPostware(server, config.postware || [])

  /**
   * RESPONSE HANDLER
   */
  // Add Response Handler
  server.use(config.onResult || defaultSuccessHandler)
  // Add Error Handler
  server.use(config.onError || defaultErrorHandler)

  return Object.assign(server, {
    log,
    db
  })
}

export default createServer
