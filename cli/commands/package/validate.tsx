import { Command } from "commander"
import { validatePackage } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
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

    const { valid, errors } = await session.task(
      "Validating package",
      validatePackage(path),
    )

    if (valid) {
      session.success("Package is valid")
      return
    }

    session.render(errors, <ErrorGrid errors={errors} groupBy="resource" />)
  })
