import { Ajv } from "ajv"
import { loadJsonSchema } from "./load.ts"

export const ajv = new Ajv({
  strict: false,
  allErrors: true,
  validateSchema: false,
  validateFormats: false,
  loadSchema: loadJsonSchema,
})
