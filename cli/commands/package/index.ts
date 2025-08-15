import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { archivePackageCommand } from "./archive.ts"
import { copyPackageCommand } from "./copy.ts"
import { errorsPackageCommand } from "./errors.tsx"
import { inferPackageCommand } from "./infer.tsx"
import { showPackageCommand } from "./show.tsx"

export const packageCommand = new Command("package")
  .configureHelp(helpConfiguration)
  .description("Data Package related commands")

  .addCommand(archivePackageCommand)
  .addCommand(copyPackageCommand)
  .addCommand(errorsPackageCommand)
  .addCommand(inferPackageCommand)
  .addCommand(showPackageCommand)
