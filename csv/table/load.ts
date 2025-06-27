import type { Dialect, Resource } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { DataFrame, scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { concat } from "nodejs-polars"

export async function loadCsvTable(resource: Partial<Resource>) {
  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  const scanOptions = getScanOptions(resource, dialect)

  console.log(firstPath)
  console.log(restPaths)

  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanCSV(firstPath, scanOptions)

  if (restPaths.length) {
    table = concat([
      table,
      ...restPaths.map(path =>
        scanCSV(path, { ...scanOptions, hasHeader: false }),
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
  //options.eolChar = dialect?.lineTerminator ?? "\r\n"
  options.quoteChar = dialect?.quoteChar
  //options.escapeChar = dialect?.escapeChar
  options.commentChar = dialect?.commentChar

  return options
}
