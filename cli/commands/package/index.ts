import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { archivePackageCommand } from "./archive.ts"
import { copyPackageCommand } from "./copy.ts"
import { errorsPackageCommand } from "./errors.tsx"
import { showPackageCommand } from "./show.ts"

export const packageCommand = new Command("package")
  .configureHelp(helpConfiguration)
  .description("Data Package related commands")

  .addCommand(errorsPackageCommand)
  .addCommand(showPackageCommand)
  .addCommand(archivePackageCommand)
  .addCommand(copyPackageCommand)
