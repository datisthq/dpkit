import { Command } from "@oclif/core"
import { loadPackage } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class PackageLoad extends Command {
  static override description = "Load a Data Package descriptor"

  static override args = {
    path: params.requriedDescriptorPath,
  }

  static override flags = {
    json: options.json,
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(PackageLoad)

    const dp = await loadPackage(args.path)

    if (flags.json) {
      this.logJson(dp)
    } else {
      console.log(dp)
    }
  }
}
