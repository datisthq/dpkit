import { inferResource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ResourceGrid } from "../../components/ResourceGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const inferResourceCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a data resource from a table")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
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
      title: "Infer resource",
      json: options.json,
      debug: options.debug,
    })

    const resource = path ? { path } : await selectResource(session, options)

    const result = await session.task(
      "Inferring resource",
      inferResource(resource, options),
    )

    if (isEmptyObject(result)) {
      Session.terminate("Could not infer resource")
    }

    await session.render(result, <ResourceGrid resource={result} />)
  })
