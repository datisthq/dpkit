import { loadDialect } from "@dpkit/lib"
import type { Resource } from "@dpkit/lib"
import { loadResourceDialect } from "@dpkit/lib"
import { Command } from "commander"
import React from "react"
import { DialectGrid } from "../../components/DialectGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

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
      path ? loadDialect(path) : loadResourceDialect(resource?.dialect),
    )

    if (!dialect || isEmptyObject(dialect)) {
      session.terminate("Dialect is not available")
      process.exit(1) // typescript ignore never return type above
    }

    await session.render(dialect, <DialectGrid dialect={dialect} />)
  })
