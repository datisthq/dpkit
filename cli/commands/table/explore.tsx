import { Command } from "commander"
import { type Resource, loadPackage, readTable } from "dpkit"
import React from "react"
import invariant from "tiny-invariant"
import { TableGrid } from "../../components/TableGrid.tsx"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const exploreTableCommand = new Command("explore")
  .description("Explore a table from a local or remote path")
  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)

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
    const session = Session.create()
    session.intro("Exploring table")

    const dialect = params.createDialectFromOptions(options)
    let resource: Partial<Resource> | undefined = path
      ? { path, dialect }
      : undefined

    if (!resource) {
      if (!options.package) {
        Session.terminate("Please provide a path argument or a package option")
      }

      const dataPackage = await session.task(
        "Loading package",
        loadPackage(options.package),
      )

      const resourceName = await session.select({
        message: "Select resource",
        options: dataPackage.resources.map(resource => ({
          label: resource.name,
          value: resource.name,
        })),
      })

      resource = dataPackage.resources.find(
        resource => resource.name === resourceName,
      )

      invariant(resource, "Resource not found")
    }

    const table = await session.task("Loading table", readTable(resource))
    await session.render(<TableGrid table={table} />)

    session.outro("Thanks for using dpkit!")
  })
