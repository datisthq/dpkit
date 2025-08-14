import { Command } from "commander"
import { readTable } from "dpkit"
import React from "react"
import { DataGrid } from "../../components/DataGrid.tsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const statsTableCommand = new Command("stats")
  .configureHelp(helpConfiguration)
  .description("Show stats for a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
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
    const session = Session.create({
      title: "Table stats",
    })

    const resource = path
      ? { path, dialect: createDialectFromOptions(options) }
      : await selectResource(session, options)

    const table = await session.task("Loading table", readTable(resource))
    const df = await session.task("Calculating stats", table.collect())

    const stats = df.describe().toRecords()

    session.render(stats, <DataGrid data={stats} />)
  })
