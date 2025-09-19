import { validateFile } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorType } from "../../helpers/error.ts"
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
  .addOption(params.debug)
  .addOption(params.quit)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate file",
      json: options.json,
      debug: options.debug,
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

    if (report.errors.length && !options.quit) {
      const type = await selectErrorType(session, report.errors)

      if (type) {
        report.errors = report.errors.filter(error => error.type === type)
      }
    }

    if (report.valid) {
      session.success("Table is valid")
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
