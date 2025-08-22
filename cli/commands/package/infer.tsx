import { Command } from "commander"
import { inferPackage } from "dpkit"
import React from "react"
import { PackageGrid } from "../../components/PackageGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const inferPackageCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a data package from local or remote file paths")

  .addArgument(params.positionalFilePaths)
  .addOption(params.json)

  .action(async (paths, options) => {
    const session = Session.create({
      title: "Infer resource",
      json: options.json,
    })

    const sourcePackage = {
      resources: paths.map(path => ({ path })),
    }

    const targetPackage = await session.task(
      "Inferring package",
      inferPackage(sourcePackage),
    )

    await session.render(
      targetPackage,
      <PackageGrid dataPackage={targetPackage} />,
    )
  })
