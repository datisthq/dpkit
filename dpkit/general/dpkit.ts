import { CkanPlugin } from "@dpkit/ckan"
import type { Plugin } from "@dpkit/core"
import { FilePlugin } from "@dpkit/file"
import { ZipPlugin } from "@dpkit/zip"

export class Dpkit {
  plugins: Plugin[] = []

  register(PluginClass: new () => Plugin) {
    this.plugins.unshift(new PluginClass())
  }
}

export const dpkit = new Dpkit()

dpkit.register(CkanPlugin)
dpkit.register(FilePlugin)
dpkit.register(ZipPlugin)
