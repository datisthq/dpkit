import { Command } from "commander"
import { loadPackage, savePackageToFolder } from "dpkit"
import * as params from "../../params/index.ts"

export const copyPackageCommand = new Command("copy")
  .description("Copy a local or remote Data Package to a local folder")
  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toFolder.makeOptionMandatory())
  .addOption(params.withRemote)
  .action(async (path, options) => {
    const dp = await loadPackage(path)

    await savePackageToFolder(dp, {
      folderPath: options.toFolder,
      withRemote: options.withRemote,
    })

    console.log(`Package from "${path}" copied to "${options.toFolder}"`)
  })
