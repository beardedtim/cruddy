import express from 'express'
import bunyan from 'bunyan'
import Knex from 'knex'
import { Schema } from 'jsonschema'

declare global {
  export interface DBConfig {
    client: string
    connection:
      | string
      | {
          host: string
          port: number
          username: string
          password: string
          database: string
        }
  }

  interface ViewConfig {
    template: string
    data: Object
  }

  interface ViewsConfig {
    create?: ViewConfig
    readOne?: ViewConfig
    readMany?: ViewConfig
    update?: ViewConfig
    destroy?: ViewConfig
  }

  export interface SchemaConfig extends Schema {
    hashed?: boolean
  }

  export interface SchemasConfig {
    create?: Schema
    readOne?: Schema
    readMany?: Schema
    update?: Schema
    destroy?: Schema
    keys?: string | Array<string>
  }

  export interface DomainConfig {
    schemas: SchemasConfig
    views: ViewsConfig
  }

  export interface DomainsConfig {
    [x: string]: DomainConfig
  }

  export interface ServerConfig {
    serviceName: string
    logLevel?: bunyan.LogLevel
    db: DBConfig
    preware: Array<() => express.Handler>
    postware: Array<() => express.Handler>
    onError: express.ErrorRequestHandler
    onResult: express.RequestHandler
    domains: DomainsConfig
    apiPrefix: string
    templateDir?: string
    tempalteType?: string
  }

  export interface RequestContext {
    log: bunyan
    db: Knex
  }
  namespace Express {
    interface Request {
      context: RequestContext
    }
  }
}
