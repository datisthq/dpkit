import { Command } from "commander"
import { loadResourceDescriptor } from "dpkit"
import type { Resource } from "dpkit"
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

  .action(async (path, options) => {
    let resource: Resource | undefined

    const session = Session.create({
      title: "Show resource",
      json: options.json,
    })

    if (!path) {
      resource = await selectResource(session, options)
    } else {
      // @ts-ignore
      resource = await session.task(
        "Loading resource",
        loadResourceDescriptor(path),
      )
    }

    if (isEmptyObject(resource)) {
      Session.terminate("Resource is not available")
    }

    await session.render(resource, <ResourceGrid resource={resource} />)
  })
