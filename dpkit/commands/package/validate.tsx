import { validatePackage } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorResource, selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validatePackageCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data package from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate package",
      json: options.json,
      debug: options.debug,
    })

    const report = await session.task(
      "Validating package",
      validatePackage(path),
    )

    if (report.errors.length && !options.quit && !options.json) {
      // @ts-ignore
      const name = await selectErrorResource(session, report.errors)
      // @ts-ignore
      if (name) report.errors = report.errors.filter(e => e.resource === name)

      const type = await selectErrorType(session, report.errors)
      // @ts-ignore
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      session.success("Table is valid")
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
