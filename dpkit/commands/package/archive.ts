import { loadPackage, savePackageToZip } from "@dpkit/all"
import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const archivePackageCommand = new Command("archive")
  .configureHelp(helpConfiguration)
  .description("Archive a local or remote Data Package to a local zip file")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toArchive)
  .addOption(params.withRemote)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Archive package",
      debug: options.debug,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    session.task(
      "Archiving package",
      savePackageToZip(dp, {
        archivePath: options.toArchive,
        withRemote: options.withRemote,
      }),
    )

    session.success(`Package from "${path}" archived to "${options.toArchive}"`)
  })
