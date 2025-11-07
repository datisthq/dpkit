import { loadDialect } from "@dpkit/library"
import type { Resource } from "@dpkit/library"
import { resolveDialect } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Dialect } from "../../components/Dialect/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const exploreDialectCommand = new Command("explore")
  .configureHelp(helpConfiguration)
  .description("Explore a table dialect from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Explore dialect",
      json: options.json,
      debug: options.debug,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const dialect = await session.task(
      "Loading dialect",
      path ? loadDialect(path) : resolveDialect(resource?.dialect),
    )

    if (!dialect || isEmptyObject(dialect)) {
      session.terminate("Dialect is not available")
      process.exit(1) // typescript ignore never return type above
    }

    await session.render(dialect, <Dialect dialect={dialect} />)
  })
