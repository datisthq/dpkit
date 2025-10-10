import { loadPackage, savePackage } from "@dpkit/lib"
import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const copyPackageCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description(
    "Copy a local or remote Data Package to a local folder, a ZIP archive or a database",
  )

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toPathRequired)
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
      savePackage(dp, {
        target: options.toPath,
        withRemote: options.withRemote,
      }),
    )

    session.success(`Package from "${path}" copied to "${options.toPath}"`)
  })
