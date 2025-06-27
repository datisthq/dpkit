import type { Dialect, Resource } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { DataFrame, scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { Utf8, concat } from "nodejs-polars"

export async function loadCsvTable(resource: Partial<Resource>) {
  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  const scanOptions = getScanOptions(resource, dialect)

  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanCSV(firstPath, scanOptions)

  const polarsSchema = Object.fromEntries(
    table.columns.map(name => [name, Utf8]),
  )

  if (restPaths.length) {
    table = concat([
      table,
      ...restPaths.map(path =>
        scanCSV(path, {
          ...scanOptions,
          hasHeader: false,
          schema: polarsSchema,
        }),
      ),
    ])
  }

  return table
}

function getScanOptions(resource: Partial<Resource>, dialect?: Dialect) {
  const options: Partial<ScanCsvOptions> = {
    inferSchemaLength: 0,
    truncateRaggedLines: true,
  }

  if (resource.encoding) {
    options.encoding = resource.encoding
  }

  options.hasHeader = dialect?.header !== false
  options.sep = dialect?.delimiter ?? ","

  // TODO: enable after this polars issues is fixed
  // https://github.com/pola-rs/nodejs-polars/issues/333
  //options.eolChar = dialect?.lineTerminator ?? "\n"

  // TODO: try convince nodejs-polars to support escapeChar
  // https://github.com/pola-rs/polars/issues/3074
  //options.escapeChar = dialect?.escapeChar

  options.quoteChar = dialect?.quoteChar

  // TODO: remove ts-ignore when issues is fixed
  // https://github.com/pola-rs/nodejs-polars/issues/334
  // @ts-ignore
  options.commentPrefix = dialect?.commentChar

  return options
}
