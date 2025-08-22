import { Command } from "commander"
import { validatePackage } from "dpkit"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
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
      title: "Package errors",
      json: options.json,
    })

    const report = await session.task("Finding errors", validatePackage(path))

    if (report.valid) {
      session.success("Package is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
