import type { Field, FieldType } from "@dpkit/core"
import { Kysely } from "kysely"
import { type ColumnMetadata, MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import { BaseDriver } from "./base.js"

export class MysqlDriver extends BaseDriver {
  nativeTypes = ["integer", "number", "string", "year"] satisfies FieldType[]

  async connectDatabase(path: string) {
    const pool = createPool({
      uri: path,
      connectionLimit: 1,
    })

    return new Kysely<any>({
      dialect: new MysqlDialect({
        pool,
      }),
    })
  }

  normalizeType(databaseType: ColumnMetadata["dataType"]) {
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
      case "binary":
      case "varbinary":
      case "tinyblob":
      case "blob":
      case "mediumblob":
      case "longblob":
        return "string"
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

  denormalizeType(fieldType: Field["type"]) {
    switch (fieldType) {
      case "string":
        return "text"
      case "integer":
        return "int"
      case "number":
        return "decimal"
      case "boolean":
        return "boolean"
      case "date":
        return "date"
      case "time":
        return "time"
      case "datetime":
        return "datetime"
      case "year":
        return "year"
      case "object":
        return "json"
      case "geojson":
        return "geometry"
      default:
        return "text"
    }
  }
}
