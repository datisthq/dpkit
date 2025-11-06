import type { JsonSchema } from "../json/index.ts"

export type Profile = JsonSchema
export type ProfileType = "dialect" | "package" | "resource" | "schema"
export type ProfileRegistry = {
  type: ProfileType
  path: string
  version: string
  profile: Profile
}[]
