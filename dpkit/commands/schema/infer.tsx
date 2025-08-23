import { Command } from "commander"
import { inferSchema, loadTable } from "dpkit"
import React from "react"
import { SchemaGrid } from "../../components/SchemaGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const inferSchemaCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a table schema from a table")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Infer schema",
      json: options.json,
    })

    const resource = path ? { path } : await selectResource(session, options)

    const table = await session.task("Loading table", loadTable(resource))

    const inferredSchema = await session.task(
      "Inferring schema",
      inferSchema(table),
    )

    if (isEmptyObject(inferredSchema)) {
      Session.terminate("Could not infer schema")
    }

    await session.render(
      inferredSchema,
      // @ts-ignore
      <SchemaGrid schema={inferredSchema} />,
    )
  })
