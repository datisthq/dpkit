import { Command } from "commander"
import { copyFile } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const copyFileCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description("Copy a local or remote file to a local path")

  .addArgument(params.positionalFilePath)
  .addOption(params.toPath.makeOptionMandatory())
  .addOption(params.fromPackage)
  .addOption(params.fromResource)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Copy file",
    })

    if (!path) {
      const resource = await selectResource(session, options)

      if (typeof resource.path !== "string") {
        Session.terminate("Only single file resources are supported")
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
