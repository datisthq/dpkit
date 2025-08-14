import { Command } from "commander"
import { validateTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.jsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"

export const validateTableCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.json)

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

  .action(async (path, options) => {
    const dialect = createDialectFromOptions(options)
    const { errors } = await validateTable({ path, dialect })

    if (options.json) {
      console.log(JSON.stringify(errors, null, 2))
      return
    }

    render(<ErrorGrid errors={errors} />)
  })
