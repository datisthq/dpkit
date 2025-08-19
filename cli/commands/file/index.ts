import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyFileCommand } from "./copy.ts"
import { statsFileCommand } from "./stats.tsx"
import { validateFileCommand } from "./validate.tsx"

export const fileCommand = new Command("file")
  .configureHelp(helpConfiguration)
  .description("File related commands")

  .addCommand(copyFileCommand)
  .addCommand(statsFileCommand)
  .addCommand(validateFileCommand)
