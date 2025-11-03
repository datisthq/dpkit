import { validateFile } from "@dpkit/lib"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../session.ts"
import * as params from "../../params/index.ts"

export const validateFileCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a file from a local or remote path")

  .addArgument(params.requiredPositionalFilePath)
  .addOption(params.bytes)
  .addOption(params.hash)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate file",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
    })

    if (!options.bytes && !options.hash) {
      session.terminate("You must specify either --bytes or --hash")
      process.exit(1) // typescript ignore never return type above
    }

    const report = await session.task(
      "Validating file",
      validateFile(path, {
        bytes: options.bytes ? Number.parseInt(options.bytes) : undefined,
        hash: options.hash,
      }),
    )

    if (report.errors.length) {
      const type = await selectErrorType(session, report.errors)
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      session.success("File is valid")
      return
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
