import type { Descriptor } from "../descriptor/Descriptor.ts"

export type Profile = Descriptor
export type ProfileType = "dialect" | "package" | "resource" | "schema"
export type ProfileRegistry = {
  type: ProfileType
  path: string
  version: string
  profile: Profile
}[]
