import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertTableCommand } from "./convert.tsx"
import { describeTableCommand } from "./describe.tsx"
import { exploreTableCommand } from "./explore.tsx"
import { scriptTableCommand } from "./script.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .configureHelp(helpConfiguration)
  .description("Table related commands")

  .addCommand(convertTableCommand)
  .addCommand(describeTableCommand)
  .addCommand(exploreTableCommand)
  .addCommand(scriptTableCommand)
  .addCommand(validateTableCommand)
