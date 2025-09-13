import { loadPackage, savePackageToFolder } from "@dpkit/all"
import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const copyPackageCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description("Copy a local or remote Data Package to a local folder")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toFolder.makeOptionMandatory())
  .addOption(params.withRemote)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Copy package",
      debug: options.debug,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    await session.task(
      "Copying package",
      savePackageToFolder(dp, {
        folderPath: options.toFolder,
        withRemote: options.withRemote,
      }),
    )

    session.success(`Package from "${path}" copied to "${options.toFolder}"`)
  })
