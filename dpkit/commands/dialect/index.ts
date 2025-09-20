import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { exploreDialectCommand } from "./explore.tsx"
import { inferDialectCommand } from "./infer.tsx"
import { scriptDialectCommand } from "./script.tsx"
import { validateDialectCommand } from "./validate.tsx"

export const dialectCommand = new Command("dialect")
  .configureHelp(helpConfiguration)
  .description("Table Dialect related commands")

  .addCommand(inferDialectCommand)
  .addCommand(exploreDialectCommand)
  .addCommand(scriptDialectCommand)
  .addCommand(validateDialectCommand)
