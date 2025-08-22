import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { errorsSchemaCommand } from "./errors.tsx"
import { inferSchemaCommand } from "./infer.tsx"
import { showSchemaCommand } from "./show.tsx"
import { validateSchemaCommand } from "./validate.tsx"

export const schemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(errorsSchemaCommand)
  .addCommand(inferSchemaCommand)
  .addCommand(showSchemaCommand)
  .addCommand(validateSchemaCommand)
