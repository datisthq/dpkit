import { intro, log, outro, select } from "@clack/prompts"
import { Command } from "commander"
import { type Resource, loadPackage, readTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import { task } from "../../helpers/task.ts"
import * as params from "../../params/index.ts"

export const exploreTableCommand = new Command("explore")
  .description("Explore a table from a local or remote path")
  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
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
    intro("Exploring table")

    const dialect = params.createDialectFromOptions(options)
    let resource: Partial<Resource> | undefined = path
      ? { path, dialect }
      : undefined

    if (!resource) {
      if (!options.package) {
        log.error("Please provide a path argument or a package option")
        return
      }

      const dataPackage = await task(
        "Loading package",
        loadPackage(options.package),
      )

      const resourceName = await select({
        message: "Select resource",
        options: dataPackage.resources.map(resource => ({
          label: resource.name,
          value: resource.name,
        })),
      })

      resource = dataPackage.resources.find(
        resource => resource.name === resourceName,
      )
    }

    // @ts-ignore
    const table = await task("Loading table", readTable(resource))

    if (options.json) {
      const df = await table.slice(0, 10).collect()
      const data = df.toRecords()
      console.log(JSON.stringify(data, null, 2))
      return
    }

    const app = render(<TableGrid table={table} />)
    await app.waitUntilExit()

    outro("Thanks for using dpkit!")
  })
