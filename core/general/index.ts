// TODO: split this general module into more focused descriptor/metadata/etc
export { parseDescriptor } from "./descriptor/process/parse.ts"
export { stringifyDescriptor } from "./descriptor/process/stringify.ts"
export { loadDescriptor } from "./descriptor/load.ts"
export { saveDescriptor } from "./descriptor/save.ts"
export { validateDescriptor } from "./descriptor/validate.ts"
export type { Descriptor } from "./descriptor/Descriptor.ts"
export type { Metadata } from "./metadata/Metadata.ts"
export { isDescriptor } from "./descriptor/Descriptor.ts"
export { loadProfile } from "./profile/load.ts"
export {
  getName,
  getFormat,
  isRemotePath,
  getBasepath,
  normalizePath,
  denormalizePath,
  getFilename,
  getProtocol,
} from "./path.ts"
