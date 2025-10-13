import { beforeAll, describe, expect, it, vi } from "vitest"
import { ajv } from "./ajv.ts"
import { validateProfile } from "./validate.ts"

describe("validateProfile", () => {
  beforeAll(() => {
    vi.spyOn(ajv, "validateSchema")
  })

  it("returns valid result for valid descriptor without options", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.profile).toEqual(descriptor)
  })

  it("returns validation errors for invalid schema", async () => {
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

    const result = await validateProfile(descriptor)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]?.message).toBe("must be string")
    expect(result.profile).toBeUndefined()
  })

  it("uses keyword when error message is not available", async () => {
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

    const result = await validateProfile(descriptor)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]?.message).toBe("required")
    expect(result.profile).toBeUndefined()
  })

  it("returns valid result for official profile path", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor, {
      path: "https://datapackage.org/profiles/1.0/datapackage.json",
      type: "package",
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.profile).toEqual(descriptor)
  })

  it("returns valid result when path matches alternate official profile", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor, {
      path: "https://specs.frictionlessdata.io/schemas/data-package.json",
      type: "package",
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.profile).toEqual(descriptor)
  })

  it("returns error for profile type mismatch", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor, {
      path: "custom-profile.json",
      type: "package",
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]?.message).toBe(
      "Profile at custom-profile.json is not a valid package profile",
    )
    expect(result.profile).toBeUndefined()
  })

  it("returns valid result when only path is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor, {
      path: "custom-profile.json",
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.profile).toEqual(descriptor)
  })

  it("returns valid result when only type is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const result = await validateProfile(descriptor, {
      type: "package",
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.profile).toEqual(descriptor)
  })

  it("returns multiple errors when both schema and type validation fail", async () => {
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

    const result = await validateProfile(descriptor, {
      path: "custom-profile.json",
      type: "package",
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(2)
    expect(result.errors[0]?.message).toBe("must be string")
    expect(result.errors[1]?.message).toBe(
      "Profile at custom-profile.json is not a valid package profile",
    )
    expect(result.profile).toBeUndefined()
  })

  it("validates different profile types correctly", async () => {
    const descriptorDialect = {
      delimiter: ",",
    }

    const resultDialect = await validateProfile(descriptorDialect, {
      path: "https://datapackage.org/profiles/1.0/tabledialect.json",
      type: "dialect",
    })

    expect(resultDialect.valid).toBe(true)

    const descriptorResource = {
      name: "test-resource",
    }

    const resultResource = await validateProfile(descriptorResource, {
      path: "https://datapackage.org/profiles/1.0/dataresource.json",
      type: "resource",
    })

    expect(resultResource.valid).toBe(true)

    const descriptorSchema = {
      fields: [],
    }

    const resultSchema = await validateProfile(descriptorSchema, {
      path: "https://datapackage.org/profiles/1.0/tableschema.json",
      type: "schema",
    })

    expect(resultSchema.valid).toBe(true)
  })
})
