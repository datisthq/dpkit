import { Args, Command, Flags } from "@oclif/core"
import { loadPackage } from "dpkit"

export default class PackageLoad extends Command {
  static override description = "Load a Data Package descriptor"

  static override args = {
    path: Args.string({
      description: "local or remote path to the package descriptor",
      required: true,
    }),
  }

  static override flags = {
    json: Flags.boolean({ char: "j", description: "output as JSON" }),
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
