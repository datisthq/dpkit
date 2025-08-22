import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const queryTableCommand = new Command("query")
  .configureHelp(helpConfiguration)
  .description(
    "Start a querying session for a table from a local or remote path",
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

  .action(async (_path, _options) => {
    // @ts-ignore
    const session = Session.create({
      title: "Query table",
    })

    Session.terminate("Query command not implemented yet")
  })
