import { Ajv } from "ajv"
import { loadProfile } from "./load.ts"

export const ajv = new Ajv({
  strict: false,
  validateSchema: false,
  validateFormats: false,
  loadSchema: loadProfile,
})
