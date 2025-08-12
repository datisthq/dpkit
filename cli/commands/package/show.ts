import { Command } from "@oclif/core"
import { loadPackage } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ShowPackage extends Command {
  static override description = "Show a Data Package descriptor"

  static override args = {
    path: params.requriedDescriptorPath,
  }

  static override flags = {
    json: options.json,
  }

  public async run() {
    const { args, flags } = await this.parse(ShowPackage)

    const dp = await loadPackage(args.path)

    if (flags.json) {
      this.logJson(dp)
      return
    }

    console.log(dp)
  }
}
