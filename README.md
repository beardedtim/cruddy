# Cruddy

## Overview

`cruddy` is a tool to help build CRUD interfaces with JSON Schema validation.

## Usage

> You can find a working demo at `demo.js` but you will have to ensure that your DB is working or use
> the docker-compose file in this repo. How to do that is beyond this package's forte.

```javascript
const { createServer } = require('cruddy')

const server = createServer({
  /**
   * A configuration object that describes the types of our data
   */
  config: {
    // How this service will log and explain itself
    serviceName: 'CRUDDY_EXAMPLE',
    apiPrefix: '/api',
    // Path to the directory that holds all templates
    templateDir: './views',
    // What type of templating engine are you using?
    templateType: 'pug',
    domains: {
      // The name to add to the api
      users: {
        schemas: {
          // Create Read Update Destroy schemas.
          // All schemas default to accepting _anything_
          create: {
            /**
             * Some JSON Schema describing the body expected
             * for create
             */
          },
          readMany: {
            /**
             * Some JSON Schema describing the query expected
             * for readMany
             */
          },
          readOne: {
            /**
             * Some JSON Schema describing the query expected
             * for readOne
             */
          },
          update: {
            /**
             * Some JSON Schema describing the body expected
             * for update
             */
          },
          destroy: {
            /**
             * Some JSON Schema describing the query expected
             * for delete
             */
          },
          /**
           * Sometimes we only want to return certain keys from this
           * item. This allows us to set that. It can be a single key
           * or an array of keys. '*' means all keys
           *
           * We don't want to return the email _EVER_ from the API
           * so we create a list of keys that we want to return
           */
          keys: ['id', 'email', 'created_at', 'last_updated']
        },

        views: {
          // Create Read Update Destroy views.
          create: {
            /**
             * Some View Schema describing the body expected
             * for create
             */
          },
          readOne: {
            /**
             * Some View Schema describing the query expected
             * for reading one item
             */
          },
          readMany: {
            /**
             * Some View Schema describing the query expected
             * for reading many items
             */
          },
          update: {
            /**
             * Some View Schema describing the body expected
             * for update
             */
          },
          destroy: {
            /**
             * Some View Schema describing the query expected
             * for delete
             */
          }
        }
      }
    }
  },
  /**
   * The configuration object for the DB. Currently gets passed
   * as-is to Knex
   */
  db: {
    client: 'postgres',
    // You can also use a string here if you have the URL
    // postgres://hello.com:2345/something
    connection: {
      host: 'abc.com',
      port: 5432,
      username: 'username',
      password: '123!',
      database: 'enough'
    }
  },
  /**
   * Any middleware that we want to be ran before any of the handlers
   * but after the global middleware such as CORS/Helmet/etc
   */
  preware: [],
  /**
   * Any middleware that we want to be ran after all the other handlers
   */
  postware: [],
  /**
   * How you want to format any errors before sending them to the client
   */
  onError: () => {},
  /**
   * How you want to format any data before sending it to the client
   */
  onSuccess: () => {}
})

server.listen(5000, () => server.log.info('Service has started'))
```
