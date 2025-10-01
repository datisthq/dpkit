import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { convertSchemaCommand } from "./convert.tsx"
import { exploreSchemaCommand } from "./explore.tsx"
import { inferSchemaCommand } from "./infer.tsx"
import { scriptSchemaCommand } from "./script.tsx"
import { validateSchemaCommand } from "./validate.tsx"

export const schemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(inferSchemaCommand)
  .addCommand(convertSchemaCommand)
  .addCommand(exploreSchemaCommand)
  .addCommand(scriptSchemaCommand)
  .addCommand(validateSchemaCommand)
