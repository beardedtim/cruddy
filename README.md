# Cruddy

## Overview

`cruddy` is a tool to help build CRUD interfaces with JSON Schema validation.

## Usage

```javascript
const { createServer } = require("cruddy");

const server = createServer({
  /**
   * A configuration object that describes the types of our data
   */
  config: {
    // How this service will log and explain itself
    serviceName: "CRUDDY_EXAMPLE",
    apiPrefix: "/api",
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
          read: {
            /**
             * Some JSON Schema describing the query expected
             * for read
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
          }
        },
        views: {
          // Create Read Update Destroy views.
          create: {
            /**
             * Some View Schema describing the body expected
             * for create
             */
          },
          read: {
            /**
             * Some View Schema describing the query expected
             * for read
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
});

server.listen(5000, () => server.log.info("Service has started"));
```
