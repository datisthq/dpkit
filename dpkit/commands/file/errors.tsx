import { validateFile } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsFileCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a file from a local or remote path")

  .addArgument(params.requiredPositionalFilePath)
  .addOption(params.bytes)
  .addOption(params.hash)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "File errors",
      json: options.json,
      debug: options.debug,
    })

    if (!options.bytes && !options.hash) {
      Session.terminate("You must specify either --bytes or --hash")
    }

    const report = await session.task(
      "Finding errors",
      validateFile(path, {
        bytes: options.bytes ? Number.parseInt(options.bytes) : undefined,
        hash: options.hash,
      }),
    )

    if (report.valid) {
      session.success("File is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
