import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadPostgresTable } from "./table/index.ts"
import { loadMysqlTable } from "./table/index.ts"
import { loadSqliteTable } from "./table/index.ts"

export class DatabasePlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const formatInfo = getFormatInfo(resource)

    if (formatInfo.isJson) {
      return await loadJsonTable(resource)
    }

    if (formatInfo.isJsonl) {
      return await loadJsonlTable(resource)
    }

    return undefined
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const formatInfo = getFormatInfo(options)

    if (formatInfo.isJson) {
      return await saveJsonTable(table, options)
    }

    if (formatInfo.isJsonl) {
      return await saveJsonlTable(table, options)
    }

    return undefined
  }
}

function getDialectName(resource: Partial<Resource>) {
  let dialectName: string | undefined

  if (resource.path) {
    const path = Array.isArray(resource.path) ? resource.path[0] : resource.path

    if (path) {
      try {
        const url = new URL(path)
        dialectName = url.protocol.replace(":", "")
      } catch {}
    }
  }

  return dialectName
}
