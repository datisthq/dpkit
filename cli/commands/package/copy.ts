import { Command } from "@oclif/core"
import { loadPackage, savePackageToFolder } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class CopyPackage extends Command {
  static override description =
    "Copy a local or remote Data Package to a local folder"

  static override args = {
    path: params.requriedDescriptorPath,
  }

  static override flags = {
    toFolder: options.requiredToFolder,
    withRemote: options.withRemote,
  }

  public async run() {
    const { args, flags } = await this.parse(CopyPackage)

    const dp = await loadPackage(args.path)

    await savePackageToFolder(dp, {
      folderPath: flags.toFolder,
      withRemote: flags.withRemote,
    })

    this.log(`Package from "${args.path}" copied to "${flags.toFolder}"`)
  }
}
