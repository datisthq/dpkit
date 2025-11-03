import { loadPackage } from "@dpkit/lib"
import { Command } from "commander"
import React from "react"
import { PackageGrid } from "../../components/PackageGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../session.ts"
import * as params from "../../params/index.ts"

export const explorePackageCommand = new Command("explore")
  .configureHelp(helpConfiguration)
  .description("Explore a Data Package descriptor")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Explore package",
      json: options.json,
      debug: options.debug,
    })

    const dataPackage = await session.task("Loading package", loadPackage(path))

    await session.render(dataPackage, <PackageGrid dataPackage={dataPackage} />)
  })
