import { Command } from "commander"
import { archivePackageCommand } from "./archive.ts"
import { copyPackageCommand } from "./copy.ts"
import { showPackageCommand } from "./show.ts"

export const packageCommand = new Command("package")
  .description("Data Package related commands")
  .addCommand(showPackageCommand)
  .addCommand(archivePackageCommand)
  .addCommand(copyPackageCommand)

