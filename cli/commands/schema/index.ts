import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { inferSchemaCommand } from "./infer.tsx"
import { showSchemaCommand } from "./show.tsx"
import { validateSchemaCommand } from "./validate.tsx"

export const schemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(inferSchemaCommand)
  .addCommand(showSchemaCommand)
  .addCommand(validateSchemaCommand)
