import { Ajv } from "ajv"
import { loadProfile } from "./load.js"

export const ajv = new Ajv({
  strict: false,
  validateSchema: false,
  validateFormats: false,
  loadSchema: path => loadProfile({ path }),
})
