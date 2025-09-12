import type { FieldType } from "@dpkit/core"
import { PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { DatabaseType } from "../field/index.ts"
import { BaseAdapter } from "./base.ts"

// TODO: Support more native types

export class PostgresqlAdapter extends BaseAdapter {
  nativeTypes = [
    "boolean",
    "datetime",
    "integer",
    "number",
    "string",
    "year",
  ] satisfies FieldType[]

  createDialect(path: string) {
    return new PostgresDialect({
      pool: new Pool({ connectionString: path }),
    })
  }

  normalizeType(databaseType: DatabaseType): FieldType {
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
      default:
        return "string"
    }
  }

  denormalizeType(fieldType: FieldType): DatabaseType {
    switch (fieldType) {
      case "boolean":
        return "boolean"
      case "datetime":
        return "timestamp"
      case "integer":
        return "integer"
      case "number":
        return "double precision"
      case "string":
        return "text"
      case "year":
        return "integer"
      default:
        return "text"
    }
  }
}
