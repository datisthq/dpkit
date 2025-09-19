import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { exploreSchemaCommand } from "./explore.tsx"
import { inferSchemaCommand } from "./infer.tsx"
import { validateSchemaCommand } from "./validate.tsx"

export const schemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(inferSchemaCommand)
  .addCommand(exploreSchemaCommand)
  .addCommand(validateSchemaCommand)
