import express from 'express'

export const createPages = (config: PagesConfig) => {
  const router = express.Router()

  for (const [pageName, { path, data, template }] of Object.entries(config)) {
    router.get(path, async (req, res) => {
      let info = {}
      if (data) {
        info = await data(req.context)
      }

      res.render(template, info)
    })
  }

  return router
}

export default createPages
