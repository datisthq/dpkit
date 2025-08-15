import { Command } from "commander"
import { validatePackage } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.jsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsPackageCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a data package from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate package",
      json: options.json,
    })

    const { errors } = await session.task(
      "Validating package",
      validatePackage(path),
    )

    // @ts-ignore
    session.render(errors, <ErrorGrid errors={errors} />)
  })
