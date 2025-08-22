import { Command } from "commander"
import { loadDescriptor, validateDialect } from "dpkit"
import type { Descriptor } from "dpkit"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsDialectCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a table dialect from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Dialect errors",
      json: options.json,
    })

    let descriptor: Descriptor | undefined

    if (!path) {
      const resource = await selectResource(session, options)

      if (!resource.dialect) {
        Session.terminate("Dialect is not available")
      }

      if (typeof resource.dialect !== "string") {
        descriptor = resource.dialect as Descriptor
      } else {
        path = resource.dialect
      }
    }

    if (!descriptor) {
      const result = await session.task(
        "Loading dialect",
        // @ts-ignore
        loadDescriptor(path),
      )

      descriptor = result.descriptor
    }

    const report = await session.task(
      "Finding errors",
      validateDialect(descriptor),
    )

    if (report.valid) {
      session.success("Dialect is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
