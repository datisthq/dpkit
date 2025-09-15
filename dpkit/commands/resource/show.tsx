import { loadResourceDescriptor } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ResourceGrid } from "../../components/ResourceGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const showResourceCommand = new Command("show")
  .configureHelp(helpConfiguration)
  .description("Show a data resource from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Show resource",
      json: options.json,
      debug: options.debug,
    })
    const resource = path
      ? await session.task("Loading resource", loadResourceDescriptor(path))
      : await selectResource(session, options)

    if (isEmptyObject(resource)) {
      Session.terminate("Resource is not available")
    }

    await session.render(resource, <ResourceGrid resource={resource} />)
  })
