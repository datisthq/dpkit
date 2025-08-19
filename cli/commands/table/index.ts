import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertTableCommand } from "./convert.tsx"
import { errorsTableCommand } from "./errors.tsx"
import { exploreTableCommand } from "./explore.tsx"
import { queryTableCommand } from "./query.tsx"
import { scriptTableCommand } from "./script.tsx"
import { statsTableCommand } from "./stats.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .configureHelp(helpConfiguration)
  .description("Table related commands")

  .addCommand(convertTableCommand)
  .addCommand(errorsTableCommand)
  .addCommand(exploreTableCommand)
  .addCommand(queryTableCommand)
  .addCommand(scriptTableCommand)
  .addCommand(statsTableCommand)
  .addCommand(validateTableCommand)
