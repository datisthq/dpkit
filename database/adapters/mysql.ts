import type { FieldType } from "@dpkit/core"
import { MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import type { DatabaseType } from "../field/index.ts"
import { BaseAdapter } from "./base.ts"

// TODO: Support more native types

export class MysqlAdapter extends BaseAdapter {
  nativeTypes = [
    "boolean",
    "datetime",
    "integer",
    "number",
    "string",
    "year",
  ] satisfies FieldType[]

  createDialect(path: string) {
    return new MysqlDialect({
      pool: createPool({ uri: path }),
    })
  }

  normalizeType(databaseType: DatabaseType): FieldType {
    switch (databaseType.toLowerCase()) {
      case "tinyint":
      case "smallint":
      case "mediumint":
      case "int":
      case "integer":
      case "bigint":
        return "integer"
      case "decimal":
      case "numeric":
      case "float":
      case "double":
      case "real":
        return "number"
      case "bit":
      case "bool":
      case "boolean":
        return "boolean"
      case "char":
      case "varchar":
      case "tinytext":
      case "text":
      case "mediumtext":
      case "longtext":
      case "enum":
      case "set":
        return "string"
      case "date":
        return "date"
      case "time":
        return "time"
      case "datetime":
      case "timestamp":
        return "datetime"
      case "year":
        return "year"
      case "json":
        return "object"
      case "geometry":
      case "point":
      case "linestring":
      case "polygon":
      case "multipoint":
      case "multilinestring":
      case "multipolygon":
      case "geometrycollection":
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
        return "datetime"
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
