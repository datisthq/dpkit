import repl from "node:repl"
import { Command } from "commander"
import { readTable } from "dpkit"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"

export const scriptTableCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description(
    "Start a scripting session for a table from a local or remote path",
  )

  .addArgument(params.positionalTablePath)

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
    const table = await readTable({ path, dialect })

    const session = repl.start({ prompt: "dp> " })
    session.context.table = table
  })
