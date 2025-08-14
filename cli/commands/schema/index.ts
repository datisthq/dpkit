import { Command } from "commander"
import { inferSchemaCommand } from "./infer.tsx"
import { showSchemaCommand } from "./show.tsx"
import { validateSchemaCommand } from "./validate.tsx"

export const schemaCommand = new Command("schema")
  .description("Table Schema related commands")
  .addCommand(inferSchemaCommand)
  .addCommand(showSchemaCommand)
  .addCommand(validateSchemaCommand)
