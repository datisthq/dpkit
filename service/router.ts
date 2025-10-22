import { validatePackage } from "./operations/package/validate.ts"

export const router = {
  package: {
    validate: validatePackage,
  },
}
