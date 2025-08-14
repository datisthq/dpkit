import { Command } from "commander"
import { loadDescriptor, validateResourceDescriptor } from "dpkit"
import type { Descriptor } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.jsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsResourceCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a data resource from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate resource",
      json: options.json,
    })

    let descriptor: Descriptor | undefined

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
      validateResourceDescriptor(descriptor),
    )

    session.render(errors, <ErrorGrid errors={errors} />)
  })
