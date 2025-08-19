import { Command } from "commander"
import { validateFile } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.jsx"
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

  .action(async (path, options) => {
    const session = Session.create({
      title: "File errors",
      json: options.json,
    })

    if (!options.bytes && !options.hash) {
      Session.terminate("You must specify either --bytes or --hash")
    }

    const { errors } = await session.task(
      "Finding errors",
      validateFile(path, {
        bytes: options.bytes ? Number.parseInt(options.bytes) : undefined,
        hash: options.hash,
      }),
    )

    // @ts-ignore
    session.render(errors, <ErrorGrid errors={errors} />)
  })
