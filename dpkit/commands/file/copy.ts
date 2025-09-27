import { copyFile } from "@dpkit/all"
import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const copyFileCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description("Copy a local or remote file to a local path")

  .addArgument(params.positionalFilePath)
  .addOption(params.toPathRequired)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Copy file",
      debug: options.debug,
    })

    if (!path) {
      const resource = await selectResource(session, options)

      if (typeof resource.path !== "string") {
        session.terminate("Only single file resources are supported")
        process.exit(1) // typescript ignore never return type above
      }

      path = resource.path
    }

    await session.task(
      "Copying file",
      copyFile({
        sourcePath: path,
        targetPath: options.toPath,
      }),
    )

    session.success(`File from "${path}" copied to "${options.toPath}"`)
  })
