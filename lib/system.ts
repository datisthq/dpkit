import { ArrowPlugin } from "@dpkit/arrow"
import { CkanPlugin } from "@dpkit/ckan"
import { CsvPlugin } from "@dpkit/csv"
import { DatabasePlugin } from "@dpkit/database"
import { DatahubPlugin } from "@dpkit/datahub"
import { FolderPlugin } from "@dpkit/folder"
import { GithubPlugin } from "@dpkit/github"
import { InlinePlugin } from "@dpkit/inline"
import { JsonPlugin } from "@dpkit/json"
import { OdsPlugin } from "@dpkit/ods"
import { ParquetPlugin } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import { XlsxPlugin } from "@dpkit/table"
import { ZenodoPlugin } from "@dpkit/zenodo"
import { ZipPlugin } from "@dpkit/zip"

export class System {
  plugins: TablePlugin[] = []

  register(PluginClass: new () => TablePlugin) {
    this.plugins.unshift(new PluginClass())
  }
}

export const system = new System()

// Dataset functions
system.register(CkanPlugin)
system.register(DatahubPlugin)
system.register(GithubPlugin)
system.register(ZenodoPlugin)
system.register(FolderPlugin)
system.register(ZipPlugin)

// Table functions
system.register(ArrowPlugin)
system.register(CsvPlugin)
system.register(InlinePlugin)
system.register(JsonPlugin)
system.register(OdsPlugin)
system.register(ParquetPlugin)
system.register(XlsxPlugin)

// Mixed functions
system.register(DatabasePlugin)
