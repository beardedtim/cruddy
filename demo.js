require('dotenv').config()
const bcrypt = require('bcrypt')

const { createServer } = require('./dist')

const config = {
  serviceName: 'MY_SERVICE',
  logLevel: 'trace',
  apiPrefix: '/api',
  staticDir: 'public',
  templateDir: 'templates',
  tempalteType: 'pug',
  db: {
    client: 'postgres',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
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
          },
          acceptFiles: true
        },
        formatters: {
          create: {
            input: async req => {
              const { password, ...user } = req.body
              const hashed = await bcrypt.hash(password, 10)

              return {
                ...user,
                password: hashed
              }
            },
            output: user => {
              console.dir(user)

              return user
            }
          }
        },
        keys: ['id', 'email', 'username', 'created_at', 'last_updated']
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
  },
  pages: {
    homePage: {
      template: 'home',
      path: '/',
      data: async context => {
        const data = await context.db.raw('SELECT NOW()')
        console.dir(data)

        return data
      }
    }
  }
}

const server = createServer(config)

server.listen(process.env.PORT, () =>
  server.log.info('I am started ' + process.env.PORT)
)
