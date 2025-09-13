import { loadSchema } from "@dpkit/all"
import type { Schema } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { SchemaGrid } from "../../components/SchemaGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const showSchemaCommand = new Command("show")
  .configureHelp(helpConfiguration)
  .description("Show a table schema from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Show schema",
      json: options.json,
      debug: options.debug,
    })

    let schema: Schema | undefined

    if (!path) {
      const resource = await selectResource(session, options)
      if (!resource.schema) {
        Session.terminate("Schema is not available")
      }

      if (typeof resource.schema !== "string") {
        schema = resource.schema
      } else {
        path = resource.schema
      }
    }

    if (!schema) {
      // @ts-ignore
      schema = await session.task("Loading schema", loadSchema(path))
    }

    if (isEmptyObject(schema)) {
      Session.terminate("Schema is not available")
    }

    await session.render(schema, <SchemaGrid schema={schema} />)
  })
