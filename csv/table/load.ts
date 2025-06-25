import type { Dialect, Resource } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { DataFrame, scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"

export async function loadCsvTable(resource: Partial<Resource>) {
  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const scanSource = getScanSource(resource)
  const scanOptions = getScanOptions(resource, dialect)

  if (!scanSource) {
    return DataFrame().lazy()
  }

  const table = scanCSV(scanSource, scanOptions)

  // TODO: support more dialect options like `skipRows`

  return table
}

// TODO: support remote paths
// TODO: support multipart paths
function getScanSource(resource: Partial<Resource>) {
  if (typeof resource.path !== "string") {
    return undefined
  }

  if (isRemotePath(resource.path)) {
    return undefined
  }

  return resource.path
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
