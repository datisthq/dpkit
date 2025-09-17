import { inferDialect } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { DialectGrid } from "../../components/DialectGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

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
      Session.terminate("Could not infer dialect")
    }

    await session.render(dialect, <DialectGrid dialect={dialect} />)
  })
