import express from 'express'
import { propOr } from 'ramda'

const defaultCreate = {
  template: 'default_create',
  data: {}
}

const defaultReadOne = {
  template: 'default_read_one',
  data: {}
}

const defaultReadMany = {
  template: 'default_read_many',
  data: {}
}

const defaultUpdate = {
  template: 'default_update',
  data: {}
}

const defaultDestroy = {
  template: 'default_destroy',
  data: {}
}

const applyView = (
  server: express.Application,
  domain: string,
  config: ViewsConfig
) => {
  const {
    create = defaultCreate,
    readOne = defaultReadOne,
    readMany = defaultReadMany,
    update = defaultUpdate,
    destroy = defaultDestroy
  } = config

  /**
   * CREATE
   */
  server.get(`/${domain}/create`, async (req, res, next) => {
    try {
      res.render(create.template, propOr({}, 'data', create))
    } catch (e) {
      return next(e)
    }
  })

  /**
   * READ MANY
   */
  server.get(`/${domain}`, async (req, res, next) => {
    try {
      const { db } = req.context
      const { limit = 50, offset = 0 } = req.query

      const list = await db(domain)
        .select('*')
        .limit(limit)
        .offset(offset)

      res.render(readMany.template, { list, ...propOr({}, 'data', readMany) })
    } catch (e) {
      return next(e)
    }
  })

  /**
   * READ ONE
   */
  server.get(`/${domain}/:id`, async (req, res, next) => {
    try {
      const { db } = req.context

      const [item] = await db(domain)
        .select('*')
        .where({
          id: req.params.id
        })

      res.render(readOne.template, { item, ...propOr({}, 'data', readOne) })
    } catch (e) {
      return next(e)
    }
  })

  /**
   * UPDATE
   */

  server.get(`/${domain}/:id/edit`, async (req, res, next) => {
    try {
      const { db } = req.context

      const [item] = await db(domain)
        .select('*')
        .where({
          id: req.params.id
        })

      res.render(update.template, { item, ...propOr({}, 'data', update) })
    } catch (e) {
      return next(e)
    }
  })

  /**
   * DELETE
   */

  server.get(`/${domain}/:id/delete`, async (req, res, next) => {
    try {
      const { db } = req.context

      const [item] = await db(domain)
        .select('*')
        .where({
          id: req.params.id
        })

      res.render(destroy.template, { item, ...propOr({}, 'data', destroy) })
    } catch (e) {
      return next(e)
    }
  })
}

export const createViews = (
  server: express.Application,
  config: DomainsConfig,
  templateDir: string = './views',
  templateType: string = 'pug'
): express.Application => {
  /**
   * VIEW ENGINE
   *
   * This tells express how to handle this
   */
  server.set('views', templateDir)
  server.set('view engine', templateType)

  for (const [domain, configuration] of Object.entries(config)) {
    applyView(server, domain, configuration.views)
  }

  return server
}

export default createViews
