import { validatePackage } from "./endpoints/package/validate.ts"

export const router = {
  planet: {
    validatePackage,
  },
}
