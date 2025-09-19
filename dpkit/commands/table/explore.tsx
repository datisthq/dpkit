import { inferSchemaFromTable, loadResourceSchema } from "@dpkit/all"
import { loadSchema } from "@dpkit/all"
import { loadDialect, loadTable, normalizeTable } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { Command } from "commander"
import { SQLContext } from "nodejs-polars"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const exploreTableCommand = new Command("explore")
  .configureHelp(helpConfiguration)
  .description("Explore a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.query)

  .optionsGroup("Table Dialect")
  .addOption(params.dialect)
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
  .addOption(params.sampleBytes)

  .optionsGroup("Table Schema")
  .addOption(params.schema)
  .addOption(params.fieldNames)
  .addOption(params.fieldTypes)
  .addOption(params.missingValues)
  .addOption(params.stringFormat)
  .addOption(params.decimalChar)
  .addOption(params.groupChar)
  .addOption(params.bareNumber)
  .addOption(params.trueValues)
  .addOption(params.falseValues)
  .addOption(params.datetimeFormat)
  .addOption(params.dateFormat)
  .addOption(params.timeFormat)
  .addOption(params.arrayType)
  .addOption(params.listDelimiter)
  .addOption(params.listItemType)
  .addOption(params.geopointFormat)
  .addOption(params.geojsonFormat)
  .addOption(params.sampleRows)
  .addOption(params.confidence)
  .addOption(params.commaDecimal)
  .addOption(params.monthFirst)
  .addOption(params.keepStrings)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Explore table",
      debug: options.debug,
    })

    const dialect = options.dialect
      ? await session.task("Loading dialect", loadDialect(options.dialect))
      : createDialectFromOptions(options)

    let schema = options.schema
      ? await session.task("Loading schema", loadSchema(options.schema))
      : undefined

    const resource: Partial<Resource> = path
      ? { path, dialect, schema }
      : await selectResource(session, options)

    let table = await session.task(
      "Loading table",
      loadTable(resource, { denormalized: true }),
    )

    if (!schema && resource.schema) {
      schema = await session.task(
        "Loading schema",
        loadResourceSchema(resource.schema),
      )
    }

    if (!schema) {
      schema = await session.task(
        "Inferring schema",
        inferSchemaFromTable(table, options),
      )
    }

    table = await session.task(
      "Normalizing table",
      normalizeTable(table, schema),
    )

    if (options.query) {
      const context = SQLContext({ self: table })
      const result = await context.execute(options.query).collect()
      table = result.lazy()
      schema = await inferSchemaFromTable(table)
    }

    await session.render(
      table,
      <TableGrid table={table} schema={schema} withTypes quit={options.quit} />,
    )
  })
