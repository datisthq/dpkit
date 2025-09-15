import { getTempFilePath, loadFile } from "@dpkit/all"
import { loadTable, saveTable } from "@dpkit/all"
import { Command } from "commander"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { createToDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
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
  .addOption(params.debug)

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

  .optionsGroup("Table Dialect (output)")
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

  // TODO: Add support for output table schema

  .action(async (path, options) => {
    const session = Session.create({
      title: "Convert table",
      debug: options.debug,
    })

    const resource = path
      ? { path, dialect: createDialectFromOptions(options) }
      : await selectResource(session, options)

    const table = await session.task(
      "Loading table",
      // TODO: Fix typing
      // @ts-ignore
      loadTable(resource, options),
    )

    const toPath = options.toPath ?? getTempFilePath()
    const toDialect = createToDialectFromOptions(options)

    await session.task(
      "Saving table",
      saveTable(table, {
        path: toPath,
        format: options.toFormat,
        dialect: toDialect,
      }),
    )

    if (!options.toPath) {
      const buffer = await loadFile(toPath)
      console.log(buffer.toString().trim())
      return
    }

    console.log(`Converted table from ${path} to ${options.toPath}`)
  })
