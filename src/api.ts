import express from 'express'
import bodyParser from 'body-parser'
import validate from './validateSchema'
import multer from 'multer'
import { pathOr, always } from 'ramda'

const createFileUploader = (upload: multer.Instance) => (name: string) => (
  config: SchemasConfig
) =>
  pathOr(false, [name, 'acceptFiles'], config)
    ? upload.fields(pathOr([{ name: 'file' }], [name, 'acceptedKeys'], config))
    : (_: any, __: any, next: express.NextFunction) => next()

const applyHandlers = (
  config: SchemasConfig,
  domain: string,
  router: express.Router,
  upload: multer.Instance
) => {
  const uploaderFor = createFileUploader(upload)
  const createUploader = uploaderFor('create')
  const updateUploader = uploaderFor('update')

  const handleReadMany: express.RequestHandler = async (req, res, next) => {
    try {
      if (config.readMany) {
        await validate(req.query, config.readMany)
      }

      const { db } = req.context
      const { limit = 50, offset = 0, keys } = req.query

      const items = await db(domain)
        .select(keys || config.keys || ['*'])
        .limit(limit)
        .offset(offset)

      res.locals.data = items
      next()
    } catch (e) {
      next(e)
    }
  }

  const handleCreate: express.RequestHandler = async (req, res, next) => {
    try {
      if (config.create) {
        await validate(req.body, config.create)
      }

      const formatters = config.formatters.create || {}

      const inputFormatter = formatters.input || always
      const outputFormatter = formatters.output || always
      const { db } = req.context
      const input = await inputFormatter(req)

      const [item] = await db
        .into(domain)
        .insert(input)
        .returning(config.keys || '*')

      res.locals.data = await outputFormatter(item)

      return next()
    } catch (e) {
      next(e)
    }
  }

  const handleReadOne: express.RequestHandler = async (req, res, next) => {
    try {
      if (config.readOne) {
        await validate(req.query, config.readOne)
      }
      const formatters = config.formatters.readOne || {}

      const outputFormatter = formatters.output || always
      const { db } = req.context
      const { limit = 50, offset = 0, keys } = req.query

      const [item] = await db(domain)
        .where({
          id: req.params.id
        })
        .select(keys || config.keys || ['*'])
        .limit(limit)
        .offset(offset)

      res.locals.data = await outputFormatter(item)

      return next()
    } catch (e) {
      next(e)
    }
  }

  const handleUpdate: express.RequestHandler = async (req, res, next) => {
    try {
      if (config.update) {
        await validate(req.body, config.update)
      }
      const { db } = req.context
      const formatters = config.formatters.update || {}

      const inputFormatter = formatters.input || always
      const outputFormatter = formatters.output || always

      const input = await inputFormatter(req)

      const [updated] = await db(domain)
        .where({
          id: req.params.id
        })
        .update(input)
        .returning(config.keys || '*')

      res.locals.data = await outputFormatter(updated)

      return next()
    } catch (e) {
      next(e)
    }
  }

  const handleDestroy: express.RequestHandler = async (req, res, next) => {
    try {
      if (config.destroy) {
        await validate(req.query, config.destroy)
      }

      const formatters = config.formatters.destroy || {}

      const outputFormatter = formatters.output || always
      const { db } = req.context

      const [deleted] = await db(domain)
        .where({
          id: req.params.id
        })
        .del()
        .returning(config.keys || '*')

      res.locals.data = await outputFormatter(deleted)

      return next()
    } catch (e) {
      next(e)
    }
  }
  router
    .get('/', handleReadMany)
    .post(
      '/',
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      createUploader(config),
      handleCreate
    )
    .get('/:id', handleReadOne)
    .patch(
      '/:id',
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      updateUploader(config),
      handleUpdate
    )
    .delete('/:id', handleDestroy)

  return router
}

const createDomainFromConfig = (
  config: DomainConfig,
  domain: string,
  upload: multer.Instance
): express.Router =>
  applyHandlers(config.schemas, domain, express.Router(), upload)

export const createAPI = (
  config: DomainsConfig,
  upload: multer.Instance
): express.Router => {
  const api = express.Router()
  for (const [domain, configuration] of Object.entries(config)) {
    api.use(`/${domain}`, createDomainFromConfig(configuration, domain, upload))
  }

  return api
}

export default createAPI
