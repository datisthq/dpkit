import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { inferDialectCommand } from "./infer.tsx"
import { showDialectCommand } from "./show.tsx"
import { validateDialectCommand } from "./validate.tsx"

export const dialectCommand = new Command("dialect")
  .configureHelp(helpConfiguration)
  .description("Table Dialect related commands")

  .addCommand(inferDialectCommand)
  .addCommand(showDialectCommand)
  .addCommand(validateDialectCommand)
