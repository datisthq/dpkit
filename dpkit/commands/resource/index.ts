import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { exploreResourceCommand } from "./explore.tsx"
import { inferResourceCommand } from "./infer.tsx"
import { scriptResourceCommand } from "./script.tsx"
import { validateResourceCommand } from "./validate.tsx"

export const resourceCommand = new Command("resource")
  .configureHelp(helpConfiguration)
  .description("Data Resource related commands")

  .addCommand(inferResourceCommand)
  .addCommand(exploreResourceCommand)
  .addCommand(scriptResourceCommand)
  .addCommand(validateResourceCommand)
