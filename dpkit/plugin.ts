import { CkanPlugin } from "@dpkit/ckan"
import { CsvPlugin } from "@dpkit/csv"
import { DatahubPlugin } from "@dpkit/datahub"
import { FolderPlugin } from "@dpkit/folder"
import { GithubPlugin } from "@dpkit/github"
import { InlinePlugin } from "@dpkit/inline"
import { JsonPlugin } from "@dpkit/json"
import type { TablePlugin } from "@dpkit/table"
import { ZenodoPlugin } from "@dpkit/zenodo"
import { ZipPlugin } from "@dpkit/zip"

export class Dpkit {
  plugins: TablePlugin[] = []

  register(PluginClass: new () => TablePlugin) {
    this.plugins.unshift(new PluginClass())
  }
}

export const dpkit = new Dpkit()

// Core functions
dpkit.register(CkanPlugin)
dpkit.register(DatahubPlugin)
dpkit.register(GithubPlugin)
dpkit.register(ZenodoPlugin)
dpkit.register(FolderPlugin)
dpkit.register(ZipPlugin)

// Table functions
dpkit.register(CsvPlugin)
dpkit.register(JsonPlugin)
dpkit.register(InlinePlugin)
