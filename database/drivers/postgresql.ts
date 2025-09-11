import type { Field, FieldType, Schema } from "@dpkit/core"
import { Kysely } from "kysely"
import { type ColumnMetadata, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { BaseDriver } from "./base.js"

export class PostgresqlDriver extends BaseDriver {
  nativeTypes = ["integer", "number", "string", "year"] satisfies FieldType[]

  async connectDatabase(path: string) {
    const pool = new Pool({
      connectionString: path,
      max: 1,
    })

    return new Kysely<any>({
      dialect: new PostgresDialect({
        pool,
      }),
    })
  }

  normalizeType(databaseType: ColumnMetadata["dataType"]) {
    switch (databaseType.toLowerCase()) {
      case "smallint":
      case "integer":
      case "int":
      case "int2":
      case "int4":
      case "int8":
      case "bigint":
      case "smallserial":
      case "serial":
      case "bigserial":
        return "integer"
      case "decimal":
      case "numeric":
      case "real":
      case "float4":
      case "double precision":
      case "float8":
        return "number"
      case "boolean":
      case "bool":
        return "boolean"
      case "char":
      case "character":
      case "varchar":
      case "character varying":
      case "text":
      case "citext":
      case "uuid":
        return "string"
      case "date":
        return "date"
      case "time":
      case "time without time zone":
      case "time with time zone":
      case "timetz":
        return "time"
      case "timestamp":
      case "timestamp without time zone":
      case "timestamp with time zone":
      case "timestamptz":
        return "datetime"
      case "interval":
        return "duration"
      case "json":
      case "jsonb":
        return "object"
      case "bytea":
        return "string"
      case "point":
      case "line":
      case "lseg":
      case "box":
      case "path":
      case "polygon":
      case "circle":
      case "geometry":
      case "geography":
        return "geojson"
      case "inet":
      case "cidr":
      case "macaddr":
      case "macaddr8":
        return "string"
      case "bit":
      case "bit varying":
      case "varbit":
        return "string"
      case "tsvector":
      case "tsquery":
        return "string"
      case "xml":
        return "string"
      default:
        return "string"
    }
  }

  denormalizeType(fieldType: Field["type"]) {
    switch (fieldType) {
      case "string":
        return "text"
      case "integer":
        return "integer"
      case "number":
        return "numeric"
      case "boolean":
        return "boolean"
      case "date":
        return "date"
      case "time":
        return "time"
      case "datetime":
        return "timestamp"
      case "duration":
        return "interval"
      case "object":
        return "jsonb"
      case "geojson":
        return "geometry"
      default:
        return "text"
    }
  }
}
