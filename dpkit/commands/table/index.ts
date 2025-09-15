import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertTableCommand } from "./convert.tsx"
import { errorsTableCommand } from "./errors.tsx"
import { exploreTableCommand } from "./explore.tsx"
import { replTableCommand } from "./repl.tsx"
import { statsTableCommand } from "./stats.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .configureHelp(helpConfiguration)
  .description("Table related commands")

  .addCommand(convertTableCommand)
  .addCommand(errorsTableCommand)
  .addCommand(exploreTableCommand)
  .addCommand(replTableCommand)
  .addCommand(statsTableCommand)
  .addCommand(validateTableCommand)
