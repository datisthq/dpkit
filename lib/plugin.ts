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
import { ParquetPlugin } from "@dpkit/parquet"
import type { TablePlugin } from "@dpkit/table"
import { XlsxPlugin } from "@dpkit/xlsx"
import { ZenodoPlugin } from "@dpkit/zenodo"
import { ZipPlugin } from "@dpkit/zip"

export class Dpkit {
  plugins: TablePlugin[] = []

  register(PluginClass: new () => TablePlugin) {
    this.plugins.unshift(new PluginClass())
  }
}

// TODO: rename to stop using dpkit name?
export const dpkit = new Dpkit()

// Core functions
dpkit.register(CkanPlugin)
dpkit.register(DatahubPlugin)
dpkit.register(GithubPlugin)
dpkit.register(ZenodoPlugin)
dpkit.register(FolderPlugin)
dpkit.register(ZipPlugin)

// Table functions
dpkit.register(ArrowPlugin)
dpkit.register(CsvPlugin)
dpkit.register(InlinePlugin)
dpkit.register(JsonPlugin)
dpkit.register(OdsPlugin)
dpkit.register(ParquetPlugin)
dpkit.register(XlsxPlugin)

// Mixed functions
dpkit.register(DatabasePlugin)
