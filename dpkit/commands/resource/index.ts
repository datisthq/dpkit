import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { inferResourceCommand } from "./infer.tsx"
import { showResourceCommand } from "./show.tsx"
import { validateResourceCommand } from "./validate.tsx"

export const resourceCommand = new Command("resource")
  .configureHelp(helpConfiguration)
  .description("Data Resource related commands")

  .addCommand(inferResourceCommand)
  .addCommand(showResourceCommand)
  .addCommand(validateResourceCommand)
