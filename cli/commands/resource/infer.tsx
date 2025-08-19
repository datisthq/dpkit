import { Command } from "commander"
import { inferResource } from "dpkit"
import React from "react"
import { ResourceGrid } from "../../components/ResourceGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const inferResourceCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a data resource from a table")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Infer resource",
      json: options.json,
    })

    const resource = path ? { path } : await selectResource(session, options)

    const result = await session.task(
      "Inferring resource",
      inferResource(resource),
    )

    if (isEmptyObject(result)) {
      Session.terminate("Could not infer resource")
    }

    await session.render(
      result,
      // @ts-ignore
      <ResourceGrid resource={result} />,
    )
  })
