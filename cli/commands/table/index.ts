import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertTableCommand } from "./convert.tsx"
import { exploreTableCommand } from "./explore.tsx"
import { queryTableCommand } from "./query.tsx"
import { scriptTableCommand } from "./script.tsx"
import { statsTableCommand } from "./stats.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .description("Table related commands")
  .configureHelp(helpConfiguration)

  .addCommand(statsTableCommand)
  .addCommand(convertTableCommand)
  .addCommand(validateTableCommand)
  .addCommand(queryTableCommand)
  .addCommand(scriptTableCommand)
  .addCommand(exploreTableCommand)
