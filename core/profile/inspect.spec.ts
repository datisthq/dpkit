import { beforeAll, describe, expect, it, vi } from "vitest"
import { ajv } from "./ajv.ts"
import { inspectProfile } from "./inspect.ts"

describe("inspectProfile", () => {
  beforeAll(() => {
    vi.spyOn(ajv, "validateSchema")
  })

  it("returns empty array for valid descriptor without options", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor)

    expect(errors).toEqual([])
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

    const errors = await inspectProfile(descriptor)

    expect(errors.length).toBe(1)
    expect(errors[0]?.message).toBe("must be string")
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

    const errors = await inspectProfile(descriptor)

    expect(errors.length).toBe(1)
    expect(errors[0]?.message).toBe("required")
  })

  it("returns empty array for official profile path", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor, {
      path: "https://datapackage.org/profiles/1.0/datapackage.json",
      type: "package",
    })

    expect(errors).toEqual([])
  })

  it("returns empty array when path matches alternate official profile", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor, {
      path: "https://specs.frictionlessdata.io/schemas/data-package.json",
      type: "package",
    })

    expect(errors).toEqual([])
  })

  it("returns error for profile type mismatch", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor, {
      path: "custom-profile.json",
      type: "package",
    })

    expect(errors.length).toBe(1)
    expect(errors[0]?.message).toBe(
      "Profile at custom-profile.json is not a valid package profile",
    )
  })

  it("returns empty array when only path is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor, {
      path: "custom-profile.json",
    })

    expect(errors).toEqual([])
  })

  it("returns empty array when only type is provided", async () => {
    const descriptor = {
      name: "test",
    }

    const errors = await inspectProfile(descriptor, {
      type: "package",
    })

    expect(errors).toEqual([])
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

    const errors = await inspectProfile(descriptor, {
      path: "custom-profile.json",
      type: "package",
    })

    expect(errors.length).toBe(2)
    expect(errors[0]?.message).toBe("must be string")
    expect(errors[1]?.message).toBe(
      "Profile at custom-profile.json is not a valid package profile",
    )
  })

  it("validates different profile types correctly", async () => {
    const descriptorDialect = {
      delimiter: ",",
    }

    const errorsDialect = await inspectProfile(descriptorDialect, {
      path: "https://datapackage.org/profiles/1.0/tabledialect.json",
      type: "dialect",
    })

    expect(errorsDialect).toEqual([])

    const descriptorResource = {
      name: "test-resource",
    }

    const errorsResource = await inspectProfile(descriptorResource, {
      path: "https://datapackage.org/profiles/1.0/dataresource.json",
      type: "resource",
    })

    expect(errorsResource).toEqual([])

    const descriptorSchema = {
      fields: [],
    }

    const errorsSchema = await inspectProfile(descriptorSchema, {
      path: "https://datapackage.org/profiles/1.0/tableschema.json",
      type: "schema",
    })

    expect(errorsSchema).toEqual([])
  })
})
