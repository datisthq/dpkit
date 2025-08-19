import { Command } from "commander"
import { validatePackage } from "dpkit"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
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

    const report = await session.task(
      "Validating package",
      validatePackage(path),
    )

    if (report.valid) {
      session.success("Package is valid")
    }

    session.render(report, <ReportGrid report={report} groupBy="resource" />)
  })
