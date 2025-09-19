import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyPackageCommand } from "./copy.ts"
import { inferPackageCommand } from "./infer.tsx"
import { publishPackageCommand } from "./publish/index.ts"
import { showPackageCommand } from "./show.tsx"
import { validatePackageCommand } from "./validate.tsx"

export const packageCommand = new Command("package")
  .configureHelp(helpConfiguration)
  .description("Data Package related commands")

  .addCommand(copyPackageCommand)
  .addCommand(inferPackageCommand)
  .addCommand(showPackageCommand)
  .addCommand(publishPackageCommand)
  .addCommand(validatePackageCommand)
