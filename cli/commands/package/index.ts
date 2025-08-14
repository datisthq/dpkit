import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { archivePackageCommand } from "./archive.ts"
import { copyPackageCommand } from "./copy.ts"
import { showPackageCommand } from "./show.ts"

export const packageCommand = new Command("package")
  .configureHelp(helpConfiguration)
  .description("Data Package related commands")

  .addCommand(showPackageCommand)
  .addCommand(archivePackageCommand)
  .addCommand(copyPackageCommand)
