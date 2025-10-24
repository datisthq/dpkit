export type { Package } from "./Package.ts"
export { assertPackage } from "./assert.ts"
export { loadPackageDescriptor } from "./load.ts"
export { savePackageDescriptor } from "./save.ts"
export { validatePackageMetadata } from "./validate.ts"
export { convertPackageFromDescriptor } from "./convert/fromDescriptor.ts"
export { convertPackageToDescriptor } from "./convert/toDescriptor.ts"
export type { Contributor } from "./Contributor.ts"
export { mergePackages } from "./merge.ts"

// TODO: Remove in v2
export { validatePackageMetadata as validatePackageDescriptor } from "./validate.ts"
