import { DatabasePlugin } from "@dpkit/database"
import { CkanPlugin } from "@dpkit/dataset"
import { DatahubPlugin } from "@dpkit/dataset"
import { FolderPlugin } from "@dpkit/dataset"
import { GithubPlugin } from "@dpkit/github"
import { CsvPlugin } from "@dpkit/table"
import { ArrowPlugin } from "@dpkit/table"
import { InlinePlugin } from "@dpkit/table"
import { JsonPlugin } from "@dpkit/table"
import { OdsPlugin } from "@dpkit/table"
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
