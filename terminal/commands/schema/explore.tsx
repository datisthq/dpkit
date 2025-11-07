import { loadSchema } from "@dpkit/library"
import type { Resource } from "@dpkit/library"
import { resolveSchema } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Schema } from "../../components/Schema/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

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
      path ? loadSchema(path) : resolveSchema(resource?.schema),
    )

    if (!schema || isEmptyObject(schema)) {
      session.terminate("Schema is not available")
      process.exit(1) // typescript ignore never return type above
    }

    await session.render(schema, <Schema schema={schema} />)
  })
