import express from 'express'
import validate from './validateSchema'

const applyHandlers = (
  config: SchemasConfig,
  domain: string,
  router: express.Router
) => {
  router
    .get('/', async (req, res, next) => {
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
    })
    .post('/', async (req, res, next) => {
      try {
        if (config.create) {
          await validate(req.body, config.create)
        }
        const { body } = req
        const { db } = req.context

        const [item] = await db
          .into(domain)
          .insert(body)
          .returning(config.keys || '*')

        res.locals.data = item

        return next()
      } catch (e) {
        next(e)
      }
    })
    .get('/:id', async (req, res, next) => {
      try {
        if (config.readOne) {
          await validate(req.query, config.readOne)
        }

        const { db } = req.context
        const { limit = 50, offset = 0, keys } = req.query

        const [item] = await db(domain)
          .where({
            id: req.params.id
          })
          .select(keys || config.keys || ['*'])
          .limit(limit)
          .offset(offset)

        res.locals.data = item

        return next()
      } catch (e) {
        next(e)
      }
    })
    .patch('/:id', async (req, res, next) => {
      try {
        if (config.update) {
          await validate(req.body, config.update)
        }

        const { body } = req
        const { db } = req.context

        const [updated] = await db(domain)
          .where({
            id: req.params.id
          })
          .update(body)
          .returning(config.keys || '*')

        res.locals.data = updated

        return next()
      } catch (e) {
        next(e)
      }
    })
    .delete('/:id', async (req, res, next) => {
      try {
        if (config.destroy) {
          await validate(req.query, config.destroy)
        }

        const { db } = req.context

        const [deleted] = await db(domain)
          .where({
            id: req.params.id
          })
          .del()
          .returning(config.keys || '*')

        res.locals.data = deleted

        return next()
      } catch (e) {
        next(e)
      }
    })

  return router
}

const createDomainFromConfig = (
  config: DomainConfig,
  domain: string
): express.Router => applyHandlers(config.schemas, domain, express.Router())

export const createAPI = (config: DomainsConfig): express.Router => {
  const api = express.Router()

  for (const [domain, configuration] of Object.entries(config)) {
    api.use(`/${domain}`, createDomainFromConfig(configuration, domain))
  }

  return api
}

export default createAPI
