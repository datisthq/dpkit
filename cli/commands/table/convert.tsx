import { getTempFilePath, loadFile } from "@dpkit/lib"
import { loadSchema } from "@dpkit/lib"
import { loadDialect } from "@dpkit/lib"
import { loadTable, saveTable } from "@dpkit/lib"
import { queryTable } from "@dpkit/lib"
import type { Resource } from "@dpkit/lib"
import { Command } from "commander"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { createToDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { createSchemaOptionsFromToSchemaOptions } from "../../helpers/schema.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const convertTableCommand = new Command("convert")
  .configureHelp(helpConfiguration)
  .description(
    "Convert a table from a local or remote source path to a target path",
  )

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.toPath)
  .addOption(params.toFormat)
  .addOption(params.overwrite)
  .addOption(params.silent)
  .addOption(params.debug)
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

  .optionsGroup("Table Dialect (output)")
  .addOption(params.toDialect)
  .addOption(params.toDelimiter)
  .addOption(params.toHeader)
  .addOption(params.toHeaderRows)
  .addOption(params.toHeaderJoin)
  .addOption(params.toCommentRows)
  .addOption(params.toCommentChar)
  .addOption(params.toQuoteChar)
  .addOption(params.toDoubleQuote)
  .addOption(params.toEscapeChar)
  .addOption(params.toNullSequence)
  .addOption(params.toSkipInitialSpace)
  .addOption(params.toProperty)
  .addOption(params.toItemType)
  .addOption(params.toItemKeys)
  .addOption(params.toSheetNumber)
  .addOption(params.toSheetName)
  .addOption(params.toTable)

  .optionsGroup("Table Schema (output)")
  .addOption(params.toSchema)
  .addOption(params.toFieldNames)
  .addOption(params.toFieldTypes)
  .addOption(params.toMissingValues)
  .addOption(params.toStringFormat)
  .addOption(params.toDecimalChar)
  .addOption(params.toGroupChar)
  .addOption(params.toBareNumber)
  .addOption(params.toTrueValues)
  .addOption(params.toFalseValues)
  .addOption(params.toDatetimeFormat)
  .addOption(params.toDateFormat)
  .addOption(params.toTimeFormat)
  .addOption(params.toArrayType)
  .addOption(params.toListDelimiter)
  .addOption(params.toListItemType)
  .addOption(params.toGeopointFormat)
  .addOption(params.toGeojsonFormat)

  // TODO: Add support for output table schema

  .action(async (path, options) => {
    const session = Session.create({
      title: "Convert table",
      text: !options.toPath,
      silent: options.silent,
      debug: options.debug,
    })

    const dialect = options.dialect
      ? await session.task("Loading dialect", loadDialect(options.dialect))
      : createDialectFromOptions(options)

    const schema = options.schema
      ? await session.task("Loading schema", loadSchema(options.schema))
      : undefined

    const resource: Partial<Resource> = path
      ? { path, dialect, schema }
      : await selectResource(session, options)

    let table = await session.task(
      "Loading table",
      loadTable(resource, options),
    )

    if (!table) {
      session.terminate("Could not load table")
      process.exit(1)
    }

    if (options.query) {
      table = queryTable(table, options.query)
    }

    const toPath = options.toPath ?? getTempFilePath()

    const toDialect = options.toDialect
      ? await session.task(
          "Loading dialect (output)",
          loadDialect(options.toDialect),
        )
      : createToDialectFromOptions(options)

    const toSchema = options.toSchema
      ? await session.task(
          "Loading schema (output)",
          loadSchema(options.toSchema),
        )
      : undefined

    await session.task(
      "Saving table",
      saveTable(table, {
        path: toPath,
        format: options.toFormat,
        dialect: toDialect,
        schema: toSchema,
        overwrite: options.overwrite,
        ...createSchemaOptionsFromToSchemaOptions(options),
      }),
    )

    if (!options.toPath) {
      const buffer = await loadFile(toPath)
      session.render(buffer.toString())
    }

    session.success(`Converted table from ${path} to ${options.toPath}`)
  })
