import { validatePackage } from "./endpoints/package/validate/handler.ts"
import { handler } from "./handler.ts"

export const router = handler.router({
  package: {
    validate: validatePackage,
  },
})
