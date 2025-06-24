import { CkanPlugin } from "@dpkit/ckan"
import type { Plugin } from "@dpkit/core"
import { CsvPlugin } from "@dpkit/csv"
import { DatahubPlugin } from "@dpkit/datahub"
import { FolderPlugin } from "@dpkit/folder"
import { GithubPlugin } from "@dpkit/github"
import { InlinePlugin } from "@dpkit/inline"
import { ZenodoPlugin } from "@dpkit/zenodo"
import { ZipPlugin } from "@dpkit/zip"

export class Dpkit {
  plugins: Plugin[] = []

  register(PluginClass: new () => Plugin) {
    this.plugins.unshift(new PluginClass())
  }
}

export const dpkit = new Dpkit()

// Package functions
dpkit.register(CkanPlugin)
dpkit.register(DatahubPlugin)
dpkit.register(GithubPlugin)
dpkit.register(ZenodoPlugin)
dpkit.register(FolderPlugin)
dpkit.register(ZipPlugin)

// Table functions
dpkit.register(CsvPlugin)
dpkit.register(InlinePlugin)
