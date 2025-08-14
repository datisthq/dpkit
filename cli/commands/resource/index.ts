import { Command } from "commander"
import { inferResourceCommand } from "./infer.tsx"
import { showResourceCommand } from "./show.tsx"
import { validateResourceCommand } from "./validate.tsx"

export const resourceCommand = new Command("resource")
  .description("Data Resource related commands")
  .addCommand(inferResourceCommand)
  .addCommand(showResourceCommand)
  .addCommand(validateResourceCommand)
