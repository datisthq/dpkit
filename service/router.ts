import { validatePackage } from "./endpoints/package/validate.ts"

export const router = {
  package: {
    validate: validatePackage,
  },
}
