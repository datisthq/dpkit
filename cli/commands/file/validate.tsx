import { Command } from "commander"
import { validateFile } from "dpkit"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateFileCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a file from a local or remote path")

  .addArgument(params.requiredPositionalFilePath)
  .addOption(params.bytes)
  .addOption(params.hash)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate file",
      json: options.json,
    })

    if (!options.bytes && !options.hash) {
      Session.terminate("You must specify either --bytes or --hash")
    }

    const report = await session.task(
      "Validating file",
      validateFile(path, {
        bytes: options.bytes ? Number.parseInt(options.bytes) : undefined,
        hash: options.hash,
      }),
    )

    if (report.valid) {
      session.success("File is valid")
    }

    session.render(report, <ReportGrid report={report} groupBy="type" />)
  })
