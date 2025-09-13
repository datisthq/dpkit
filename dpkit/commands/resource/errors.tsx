import { validateResource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsResourceCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a data resource from a local or remote path")

  .addArgument(params.optionalPositionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Resource errors",
      json: options.json,
      debug: options.debug,
    })

    const descriptor = path ? path : await selectResource(session, options)

    const report = await session.task(
      "Finding errors",
      validateResource(descriptor),
    )

    if (report.valid) {
      session.success("Resource is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
