import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { ckanPublishPackageCommand } from "./ckan.ts"
import { githubPublishPackageCommand } from "./github.ts"
import { zenodoPublishPackageCommand } from "./zenodo.ts"

export const publishPackageCommand = new Command("publish")
  .configureHelp(helpConfiguration)
  .description("Publish data packages to various platforms")

  .addCommand(ckanPublishPackageCommand)
  .addCommand(githubPublishPackageCommand)
  .addCommand(zenodoPublishPackageCommand)
