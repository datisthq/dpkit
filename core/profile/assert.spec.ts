import { beforeAll, describe, expect, it, vi } from "vitest"
import { ajv } from "./ajv.ts"
import { assertProfile } from "./assert.ts"

describe("assertProfile", () => {
  beforeAll(() => {
    vi.spyOn(ajv, "validateSchema")
  })

  it("returns profile for valid descriptor without options", async () => {
    const descriptor = {
      name: "test",
    }

    const profile = await assertProfile(descriptor)

    expect(profile).toEqual(descriptor)
  })

  it("throws error for invalid schema", async () => {
    const descriptor = {
      name: "test",
    }

    vi.mocked(ajv.validateSchema).mockImplementationOnce(async () => {
      ajv.errors = [
        {
          keyword: "type",
          instancePath: "/name",
          schemaPath: "#/properties/name/type",
          params: {},
          message: "must be string",
        },
      ]
    })

    await expect(assertProfile(descriptor)).rejects.toThrow(
      "Profile at path undefined is invalid",
    )
  })

  it("throws error when error message is not available", async () => {
    const descriptor = {
      name: "test",
    }

    vi.mocked(ajv.validateSchema).mockImplementationOnce(async () => {
      ajv.errors = [
        {
          keyword: "required",
          instancePath: "",
          schemaPath: "#/required",
          params: {},
          message: undefined,
        },
      ]
    })

    await expect(assertProfile(descriptor)).rejects.toThrow(
      "Profile at path undefined is invalid",
    )
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

  it("throws error for profile type mismatch", async () => {
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

  it("throws error when both schema and type validation fail", async () => {
    const descriptor = {
      name: "test",
    }

    vi.mocked(ajv.validateSchema).mockImplementationOnce(async () => {
      ajv.errors = [
        {
          keyword: "type",
          instancePath: "/name",
          schemaPath: "#/properties/name/type",
          params: {},
          message: "must be string",
        },
      ]
    })

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
