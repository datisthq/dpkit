import { Command } from "commander"
import { getTempFilePath, loadFile } from "dpkit"
import { readTable, saveTable } from "dpkit"
import * as params from "../../params/index.ts"

export const convertTableCommand = new Command("convert")
  .description(
    "Convert a table from a local or remote source path to a target path",
  )
  .addArgument(params.positionalTablePath)
  .addOption(params.toPath)
  .addOption(params.toFormat)
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
  .action(async (path, options) => {
    const dialect = params.createDialectFromOptions(options)
    const table = await readTable({ path, dialect })

    const toPath = options.toPath ?? getTempFilePath()
    const toDialect = params.createToDialectFromOptions(options)
    await saveTable(table, {
      path: toPath,
      format: options.toFormat,
      dialect: toDialect,
    })

    if (!options.toPath) {
      const buffer = await loadFile(toPath)
      console.log(buffer.toString().trim())
      return
    }

    console.log(`Converted table from ${path} to ${options.toPath}`)
  })
