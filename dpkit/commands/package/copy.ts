import { Command } from "commander"
import { loadPackage, savePackageToFolder } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const copyPackageCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description("Copy a local or remote Data Package to a local folder")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toFolder.makeOptionMandatory())
  .addOption(params.withRemote)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate package",
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
