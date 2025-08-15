import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyFileCommand } from "./copy.ts"

export const fileCommand = new Command("file")
  .configureHelp(helpConfiguration)
  .description("File related commands")

  .addCommand(copyFileCommand)
