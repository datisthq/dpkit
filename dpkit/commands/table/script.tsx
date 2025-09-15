import repl from "node:repl"
import type { Resource } from "@dpkit/all"
import { loadDialect } from "@dpkit/all"
import { loadTable } from "@dpkit/all"
import { Command } from "commander"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const scriptTableCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description(
    "Start a scripting session for a table from a local or remote path",
  )

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
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

  .action(async (path, options) => {
    const session = Session.create({
      title: "Script table",
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
      // TODO: Fix typing
      // @ts-ignore
      loadTable(resource, options),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.table = table
    replSession.write("table")
  })
