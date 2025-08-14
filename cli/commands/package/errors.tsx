import { Command } from "commander"
import { loadDescriptor, validatePackageDescriptor } from "dpkit"
import type { Descriptor } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.jsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsPackageCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a data package from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    let descriptor: Descriptor | undefined

    const session = Session.create({
      title: "Validate package",
      json: options.json,
    })

    if (!path) {
      const resource = await selectResource(session, options)
      descriptor = resource as unknown as Descriptor
    } else {
      const result = await session.task(
        "Loading descriptor",
        // @ts-ignore
        loadDescriptor(path),
      )

      descriptor = result.descriptor
    }

    const { errors } = await session.task(
      "Validating descriptor",
      validatePackageDescriptor(descriptor),
    )

    session.render(errors, <ErrorGrid errors={errors} />)
  })
