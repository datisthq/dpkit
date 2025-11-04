import type { Descriptor } from "../descriptor/index.ts"
import type { MetadataError } from "../error/index.ts"
import { inspectJsonValue } from "../json/index.ts"
import { createReport } from "../report/index.ts"
import type { Profile } from "./Profile.ts"
import { resolveProfile } from "./resolve.ts"

export async function validateDescriptor(
  descriptor: Descriptor,
  options: {
    profile: Profile | string
  },
) {
  const profile = await resolveProfile(options.profile)
  const errors = await inspectJsonValue(descriptor, { jsonSchema: profile })

  return createReport<MetadataError>(
    errors.map(error => ({
      type: "metadata",
      ...error,
    })),
  )
}
