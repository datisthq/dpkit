import { loadSchema } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { loadResourceSchema } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { SchemaGrid } from "../../components/SchemaGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const exploreSchemaCommand = new Command("explore")
  .configureHelp(helpConfiguration)
  .description("Explore a table schema from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Explore schema",
      json: options.json,
      debug: options.debug,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const schema = await session.task(
      "Loading schema",
      path ? loadSchema(path) : loadResourceSchema(resource?.schema),
    )

    if (!schema || isEmptyObject(schema)) {
      Session.terminate("Schema is not available")
    }

    await session.render(schema, <SchemaGrid schema={schema} />)
  })
