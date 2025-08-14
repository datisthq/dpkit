import { Command } from "commander"
import { loadPackage } from "dpkit"
import React from "react"
import { PackageGrid } from "../../components/PackageGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const showPackageCommand = new Command("show")
  .configureHelp(helpConfiguration)
  .description("Show a Data Package descriptor")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Show package",
      json: options.json,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    await session.render(dp, <PackageGrid dataPackage={dp} />)
  })
