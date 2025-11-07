import { inferPackage } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Package } from "../../components/Package/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const inferPackageCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a data package from local or remote file paths")

  .addArgument(params.positionalFilePaths)
  .addOption(params.json)
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
  .addOption(params.sampleBytes)

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
  .addOption(params.sampleRows)
  .addOption(params.confidence)
  .addOption(params.commaDecimal)
  .addOption(params.monthFirst)
  .addOption(params.keepStrings)

  .action(async (paths, options) => {
    const session = Session.create({
      title: "Infer package",
      json: options.json,
      debug: options.debug,
    })

    const sourcePackage = {
      resources: paths.map(path => ({ path })),
    }

    const targetPackage = await session.task(
      "Inferring package",
      inferPackage(sourcePackage, options),
    )

    await session.render(targetPackage, <Package dataPackage={targetPackage} />)
  })
