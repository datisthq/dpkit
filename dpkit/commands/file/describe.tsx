import { describeFile } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { DataGrid } from "../../components/DataGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const describeFileCommand = new Command("describe")
  .configureHelp(helpConfiguration)
  .description("Show stats for a local or remote file")

  .addArgument(params.positionalFilePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.hashType)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Describe file",
      json: options.json,
      debug: options.debug,
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

    session.render(stats, <DataGrid records={[stats]} />)
  })
