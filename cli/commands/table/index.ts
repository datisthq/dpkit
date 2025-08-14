import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertTableCommand } from "./convert.tsx"
import { describeTableCommand } from "./describe.tsx"
import { exploreTableCommand } from "./explore.tsx"
import { queryTableCommand } from "./query.tsx"
import { scriptTableCommand } from "./script.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .description("Table related commands")
  .configureHelp(helpConfiguration)

  .addCommand(describeTableCommand)
  .addCommand(convertTableCommand)
  .addCommand(validateTableCommand)
  .addCommand(queryTableCommand)
  .addCommand(scriptTableCommand)
  .addCommand(exploreTableCommand)
