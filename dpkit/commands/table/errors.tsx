import { loadTable, validateTable } from "@dpkit/all"
import { loadDialect } from "@dpkit/all"
import { inferSchemaFromTable, loadResourceSchema } from "@dpkit/all"
import type { Resource, Schema } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsTableCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Validate a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

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

  .optionsGroup("Table Schema")
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

  // TODO: Support schema options

  .action(async (path, options) => {
    const session = Session.create({
      title: "Table errors",
      json: options.json,
      debug: options.debug,
    })

    const dialect = options.dialect
      ? await loadDialect(options.dialect)
      : createDialectFromOptions(options)

    const resource: Partial<Resource> = path
      ? { path, dialect }
      : await selectResource(session, options)

    const table = await session.task(
      "Loading table",
      loadTable(resource, { denormalized: true }),
    )

    let schema: Schema | undefined
    if (resource.schema) {
      schema = await session.task(
        "Loading schema",
        loadResourceSchema(resource.schema),
      )
    }

    if (!schema) {
      schema = await session.task(
        "Inferring schema",
        // TODO: Fix typing
        // @ts-ignore
        inferSchemaFromTable(table, options),
      )
    }

    const report = await session.task(
      "Finding errors",
      validateTable(table, { schema }),
    )

    if (report.valid) {
      session.success("Table is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
