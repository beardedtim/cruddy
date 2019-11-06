require('dotenv').config()

const { createServer } = require('./dist')

const config = {
  serviceName: 'MY_SERVICE',
  logLevel: 'trace',
  dbConfig,
  apiPrefix: '/api',
  templateDir: 'templates',
  tempalteType: 'pug',
  db: {
    client: 'postgres',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  },
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
