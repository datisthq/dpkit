import { Command } from "@oclif/core"
import { loadPackage, savePackageToZip } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ArchivePackage extends Command {
  static override description =
    "Archive a local or remote Data Package to a local zip file"

  static override args = {
    path: params.requriedDescriptorPath,
  }

  static override flags = {
    toArchive: options.requiredToArchive,
    withRemote: options.withRemote,
  }

  public async run() {
    const { args, flags } = await this.parse(ArchivePackage)

    const dp = await loadPackage(args.path)

    await savePackageToZip(dp, {
      archivePath: flags.toArchive,
      withRemote: flags.withRemote,
    })

    this.log(`Package from "${args.path}" archived to "${flags.toArchive}"`)
  }
}
