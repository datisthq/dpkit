import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { archivePackageCommand } from "./archive.ts"
import { copyPackageCommand } from "./copy.ts"
import { errorsPackageCommand } from "./errors.tsx"
import { inferPackageCommand } from "./infer.tsx"
import { publishPackageCommand } from "./publish/index.ts"
import { showPackageCommand } from "./show.tsx"
import { validatePackageCommand } from "./validate.ts"

export const packageCommand = new Command("package")
  .configureHelp(helpConfiguration)
  .description("Data Package related commands")

  .addCommand(archivePackageCommand)
  .addCommand(copyPackageCommand)
  .addCommand(errorsPackageCommand)
  .addCommand(inferPackageCommand)
  .addCommand(showPackageCommand)
  .addCommand(publishPackageCommand)
  .addCommand(validatePackageCommand)
