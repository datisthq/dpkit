import { Command } from "commander"
import { describeFile } from "dpkit"
import React from "react"
import { DataGrid } from "../../components/DataGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const statsFileCommand = new Command("stats")
  .configureHelp(helpConfiguration)
  .description("Show stats for a local or remote file")

  .addArgument(params.positionalFilePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.hashType)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "File stats",
      json: options.json,
    })

    if (!path) {
      const resource = await selectResource(session, options)

      if (typeof resource.path !== "string") {
        Session.terminate("Only single file resources are supported")
      }

      path = resource.path
    }

    const stats = await session.task(
      "Calculating stats",
      describeFile(path, { hashType: options.hashType }),
    )

    session.render(stats, <DataGrid data={[stats]} />)
  })
