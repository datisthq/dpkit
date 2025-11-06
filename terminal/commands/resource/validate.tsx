import { validateResource } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const validateResourceCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data resource from a local or remote path")

  .addArgument(params.optionalPositionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate resource",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
    })

    const descriptor = path ? path : await selectResource(session, options)

    const report = await session.task(
      "Validating resource",
      validateResource(descriptor),
    )

    if (report.errors.length) {
      const type = await selectErrorType(session, report.errors)
      // @ts-ignore
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      if (options.json) {
        session.render(report)
      } else {
        session.success("Resource is valid")
      }
      return
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
