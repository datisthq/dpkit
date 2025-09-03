import type { ColumnDataType, Kysely } from "kysely"
import type { DataType } from "nodejs-polars"

export interface BaseDriver {
  connectDatabase(path: string): Promise<Kysely<any>>
  convertTypeFromPolarsToSql(polarsType: DataType): ColumnDataType
}
