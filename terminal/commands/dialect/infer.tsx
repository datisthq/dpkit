import { inferDialect } from "@dpkit/library"
import type { Resource } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Dialect } from "../../components/Dialect/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const inferDialectCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a table dialect from a table")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.sampleBytes)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Infer dialect",
      json: options.json,
      debug: options.debug,
    })

    const resource: Partial<Resource> = path
      ? { path }
      : await selectResource(session, options)

    const dialect = await session.task(
      "Inferring dialect",
      inferDialect(resource, options),
    )

    if (isEmptyObject(dialect)) {
      session.terminate("Could not infer dialect")
      process.exit(1) // typescript ignore never return type above
    }

    await session.render(dialect, <Dialect dialect={dialect} />)
  })
