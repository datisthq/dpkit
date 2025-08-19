import { Command } from "commander"
import { validateTable } from "dpkit"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateTableCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate Table",
      json: options.json,
    })

    const resource = path
      ? { path, dialect: createDialectFromOptions(options) }
      : await selectResource(session, options)

    const { valid, errors } = await session.task(
      "Validating table",
      validateTable(resource),
    )

    if (valid) {
      session.success("Table is valid")
      return
    }

    session.render(errors, <ErrorGrid errors={errors} groupBy="type" />)
  })
