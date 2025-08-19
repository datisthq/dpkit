import { Command } from "commander"
import { validateResource } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateResourceCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data resource from a local or remote path")

  .addArgument(params.optionalPositionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate resource",
      json: options.json,
    })

    const descriptor = path ? path : await selectResource(session, options)

    const { valid, errors } = await session.task(
      "Validating resource",
      validateResource(descriptor),
    )

    if (valid) {
      session.success("Resource is valid")
      return
    }

    session.render(errors, <ErrorGrid errors={errors} byType />)
  })
