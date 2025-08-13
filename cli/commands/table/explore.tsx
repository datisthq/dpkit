import { Command } from "commander"
import { readTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import * as params from "../../params/index.ts"

export const exploreTableCommand = new Command("explore")
  .description("Explore a table from a local or remote path")
  .addArgument(params.positionalTablePath)
  .addOption(params.json)
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
    const dialect = params.createDialectFromOptions(options)
    const table = await readTable({ path, dialect })

    if (options.json) {
      const df = await table.slice(0, 10).collect()
      const data = df.toRecords()
      console.log(JSON.stringify(data, null, 2))
      return
    }

    render(<TableGrid table={table} />)
  })
