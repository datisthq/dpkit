import { Command } from "commander"
import { loadPackage, savePackageToZip } from "dpkit"
import * as params from "../../params/index.ts"

export const archivePackageCommand = new Command("archive")
  .description("Archive a local or remote Data Package to a local zip file")
  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toArchive.makeOptionMandatory())
  .addOption(params.withRemote)
  .action(async (path, options) => {
    const dp = await loadPackage(path)

    await savePackageToZip(dp, {
      archivePath: options.toArchive,
      withRemote: options.withRemote,
    })

    console.log(`Package from "${path}" archived to "${options.toArchive}"`)
  })
