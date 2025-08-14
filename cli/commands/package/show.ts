import { Command } from "commander"
import { loadPackage } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"

export const showPackageCommand = new Command("show")
  .configureHelp(helpConfiguration)
  .description("Show a Data Package descriptor")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)

  .action(async (path, options) => {
    const dp = await loadPackage(path)

    if (options.json) {
      console.log(JSON.stringify(dp, null, 2))
      return
    }

    console.log(dp)
  })
