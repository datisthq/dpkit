import { validateResource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
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
  .addOption(params.debug)

  .optionsGroup("Table Dialect")
  .addOption(params.delimiter)
  .addOption(params.header)
  .addOption(params.headerRows)
  .addOption(params.headerJoin)
  .addOption(params.commentRows)
  .addOption(params.commentChar)
  .addOption(params.quoteChar)
  .addOption(params.doubleQuote)
  .addOption(params.escapeChar)
  .addOption(params.nullSequence)
  .addOption(params.skipInitialSpace)
  .addOption(params.property)
  .addOption(params.itemType)
  .addOption(params.itemKeys)
  .addOption(params.sheetNumber)
  .addOption(params.sheetName)
  .addOption(params.table)

  // TODO: Add schema options

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate Table",
      json: options.json,
      debug: options.debug,
    })

    const resource = path
      ? { path, dialect: createDialectFromOptions(options) }
      : await selectResource(session, options)

    const report = await session.task(
      "Validating table",
      validateResource(resource),
    )

    if (report.valid) {
      session.success("Table is valid")
    }

    session.render(report, <ReportGrid report={report} groupBy="type" />)
  })
