import express from 'express'
import bunyan from 'bunyan'
import Knex from 'knex'
import { Schema } from 'jsonschema'

declare global {
  export interface PageConfig {
    path: string
    template: string
    data?: (ctx: RequestContext) => Promise<any>
  }

  export interface PagesConfig {
    [x: string]: PageConfig
  }

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
    acceptFiles?: boolean
    acceptAnyFiles?: boolean
    fileKeys?: {
      name: string
      maxCount?: number
    }
  }

  export interface Formatter {
    input?: (req: express.Request) => any
    output?: (data: any) => any
  }

  export interface SchemasConfig {
    create?: SchemaConfig
    readOne?: SchemaConfig
    readMany?: SchemaConfig
    update?: SchemaConfig
    destroy?: SchemaConfig
    keys?: string | Array<string>
    formatters: {
      create: Formatter
      update: Formatter
      readMany: Formatter
      readOne: Formatter
      destroy: Formatter
    }
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
    staticDir?: string
    templateDir?: string
    tempalteType?: string
    pages?: PagesConfig
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
