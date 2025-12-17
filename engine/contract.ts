import { validatePackage } from "./endpoints/package/validate/contract.ts"

// TODO: Move away from contract/handler endpoints

export const contract = {
  package: {
    validate: validatePackage,
  },
}
