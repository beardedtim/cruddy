require('dotenv').config()

const { createServer } = require('./dist')
const dbConfig = require('./knexfile')

const config = {
  serviceName: 'MY_SERVICE',
  logLevel: 'trace',
  dbConfig,
  apiPrefix: '/api',
  templateDir: 'templates',
  tempalteType: 'pug',
  db: dbConfig,
  domains: {
    users: {
      schemas: {
        create: {
          title: 'CreateUser',
          description: 'This is the data we need to create a user',
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              required: true
            },
            password: {
              type: 'string',
              required: true
            }
          }
        }
      },
      views: {
        create: {
          template: 'create_user',
          data: {
            title: 'Create a User!'
          }
        }
      }
    }
  }
}

const server = createServer(config)

server.listen(process.env.PORT, () =>
  server.log.info('I am started ' + process.env.PORT)
)
