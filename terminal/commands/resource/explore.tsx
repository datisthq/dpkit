import { loadResourceDescriptor } from "frictionless-ts"
import { Command } from "commander"
import React from "react"
import { Resource } from "../../components/Resource/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const exploreResourceCommand = new Command("explore")
  .configureHelp(helpConfiguration)
  .description("Explore a data resource from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Explore resource",
      json: options.json,
      debug: options.debug,
    })
    const resource = path
      ? await session.task("Loading resource", loadResourceDescriptor(path))
      : await selectResource(session, options)

    if (isEmptyObject(resource)) {
      session.terminate("Resource is not available")
      process.exit(1) // typescript ignore never return type above
    }

    await session.render(resource, <Resource resource={resource} />)
  })
