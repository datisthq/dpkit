import { validatePackage } from "./endpoints/package/validate/contract.ts"

export const contract = {
  package: {
    validate: validatePackage,
  },
}
