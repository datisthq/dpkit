import { describe, expect, it } from "vitest"
import { assertProfile } from "./assert.ts"

describe("assertProfile", () => {
  it("returns profile for valid descriptor without options", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor)

    expect(profile).toEqual(descriptor)
  })

  it("throws error for custom profile path with mismatched type", async () => {
    const descriptor = {
      name: "test",
    }

    await expect(
      assertProfile(descriptor, {
        path: "custom-profile.json",
        type: "package",
      }),
    ).rejects.toThrow("Profile at path custom-profile.json is invalid")
  })

  it("returns profile for official profile path", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor, {
      path: "https://datapackage.org/profiles/1.0/datapackage.json",
      type: "package",
    })

    expect(profile).toEqual(descriptor)
  })

  it("returns profile when path matches alternate official profile", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor, {
      path: "https://specs.frictionlessdata.io/schemas/data-package.json",
      type: "package",
    })

    expect(profile).toEqual(descriptor)
  })

  it("throws error when profile path does not match the specified type", async () => {
    const descriptor = {
      name: "test",
    }

    await expect(
      assertProfile(descriptor, {
        path: "https://datapackage.org/profiles/1.0/tableschema.json",
        type: "package",
      }),
    ).rejects.toThrow(
      "Profile at path https://datapackage.org/profiles/1.0/tableschema.json is invalid",
    )
  })

  it("returns profile when only path is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor, {
      path: "custom-profile.json",
    })

    expect(profile).toEqual(descriptor)
  })

  it("returns profile when only type is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor, {
      type: "package",
    })

    expect(profile).toEqual(descriptor)
  })

  it("returns profile when descriptor extends official profile via allOf", async () => {
    const descriptor = {
      name: "test",
      allOf: ["https://datapackage.org/profiles/1.0/datapackage.json"],
    }

    const profile = await assertProfile(descriptor, {
      path: "custom-profile.json",
      type: "package",
    })

    expect(profile).toEqual(descriptor)
  })

  it("throws error when custom profile does not extend matching official profile", async () => {
    const descriptor = {
      name: "test",
      allOf: ["https://datapackage.org/profiles/1.0/tableschema.json"],
    }

    await expect(
      assertProfile(descriptor, {
        path: "custom-profile.json",
        type: "package",
      }),
    ).rejects.toThrow("Profile at path custom-profile.json is invalid")
  })

  it("validates different profile types correctly", async () => {
    const descriptorDialect = {
      delimiter: ",",
    }

    const profileDialect = await assertProfile(descriptorDialect, {
      path: "https://datapackage.org/profiles/1.0/tabledialect.json",
      type: "dialect",
    })

    expect(profileDialect).toEqual(descriptorDialect)

    const descriptorResource = {
      name: "test-resource",
    }

    const profileResource = await assertProfile(descriptorResource, {
      path: "https://datapackage.org/profiles/1.0/dataresource.json",
      type: "resource",
    })

    expect(profileResource).toEqual(descriptorResource)

    const descriptorSchema = {
      fields: [],
    }

    const profileSchema = await assertProfile(descriptorSchema, {
      path: "https://datapackage.org/profiles/1.0/tableschema.json",
      type: "schema",
    })

    expect(profileSchema).toEqual(descriptorSchema)
  })
})
