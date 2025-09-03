import type { ColumnDataType, Kysely } from "kysely"
import type { DataType } from "nodejs-polars"

export abstract class BaseDriver {
  abstract connectDatabase(url: string): Promise<Kysely<any>>
  abstract convertTypeFromPolarsToSql(polarsType: DataType): ColumnDataType
}
