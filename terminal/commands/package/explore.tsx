import { loadPackage } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Package } from "../../components/Package/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

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

    await session.render(dataPackage, <Package dataPackage={dataPackage} />)
  })
