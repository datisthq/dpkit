import { Command } from "commander"
import { validatePackage } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validatePackageCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data package from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate package",
      json: options.json,
    })

    const { valid } = await session.task(
      "Validating package",
      validatePackage(path),
    )

    valid
      ? session.success("Package is valid")
      : session.error("Package is not valid")
  })
