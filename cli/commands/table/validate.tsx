import { loadTable, validateTable } from "@dpkit/lib"
import { loadSchema } from "@dpkit/lib"
import { inferSchemaFromTable, resolveSchema } from "@dpkit/lib"
import { loadDialect } from "@dpkit/lib"
import type { Resource } from "@dpkit/lib"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../session.ts"
import * as params from "../../params/index.ts"

export const validateTableCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

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

  // TODO: Add schema options

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate Table",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
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

    const table = await session.task(
      "Loading table",
      loadTable(resource, { denormalized: true }),
    )

    if (!table) {
      session.terminate("Could not load table")
      process.exit(1)
    }

    if (!schema && resource.schema) {
      schema = await session.task(
        "Loading schema",
        resolveSchema(options.schema ?? resource.schema),
      )
    }

    if (!schema) {
      schema = await session.task(
        "Inferring schema",
        inferSchemaFromTable(table, options),
      )
    }

    const report = await session.task(
      "Validating table",
      validateTable(table, { schema }),
    )

    if (report.errors.length) {
      const type = await selectErrorType(session, report.errors)
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      session.success("Table is valid")
      return
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
