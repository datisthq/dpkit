import { relative } from "node:path"
import type { Package } from "@dpkit/metadata"
import { loadPackageDescriptor } from "@dpkit/metadata"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { savePackageToCkan } from "./save.ts"

describe("savePackageToCkan", () => {
  const getFixturePath = (name: string) =>
    relative(process.cwd(), `${import.meta.dirname}/fixtures/${name}`)

  const mockPackage: Package = {
    name: "test-package",
    title: "Test Package",
    description: "A test package",
    version: "1.0.0",
    resources: [
      {
        name: "test-resource",
        path: getFixturePath("data.csv"),
        format: "csv",
        bytes: 100,
      },
    ],
  }

  const mockOptions = {
    apiKey: "test-api-key",
    ckanUrl: "https://ckan.example.com",
    ownerOrg: "test-org",
    datasetName: "test-dataset",
  }

  const originalFetch = globalThis.fetch
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    // @ts-ignore
    globalThis.fetch = fetchMock
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.resetAllMocks()
  })

  it.skip("should save a package", async () => {
    const dataPackage = await loadPackageDescriptor(
      "core/package/fixtures/package.json",
    )

    const result = await savePackageToCkan(dataPackage, {
      ckanUrl: "http://localhost:5000/",
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ1T0Y0VUNybTU5Y0dzdlk3ejhreF9CeC02R0w4RDBOdW9QS0J0WkJFXzlJIiwiaWF0IjoxNzQ3OTI0NDg5fQ.ioGiLlZkm24xHQRBas5X5ig5eU7u_fIjkl4oifGnLaA",
      datasetName: "test",
      ownerOrg: "test",
    })

    expect(result).toBeDefined()
  })

  it("creates a package in CKAN with correct API calls", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-1",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-1",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-2",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-2",
          },
        }),
    })

    const result = await savePackageToCkan(mockPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(3)

    const packageCreateCall = fetchMock.mock.calls[0]
    expect(packageCreateCall).toBeDefined()
    if (!packageCreateCall) return

    expect(packageCreateCall[0]).toEqual(
      "https://ckan.example.com/api/3/action/package_create",
    )
    expect(packageCreateCall[1]).toMatchObject({
      method: "POST",
      headers: {
        Authorization: "test-api-key",
        "Content-Type": "application/json",
      },
    })

    const packagePayload = JSON.parse(packageCreateCall[1].body)
    expect(packagePayload.name).toEqual("test-dataset")
    expect(packagePayload.owner_org).toEqual("test-org")
    expect(packagePayload.title).toEqual("Test Package")
    expect(packagePayload.notes).toEqual("A test package")
    expect(packagePayload.resources).toEqual([])

    expect(result).toEqual({
      path: "https://ckan.example.com/dataset/test-dataset",
      datasetUrl: "https://ckan.example.com/dataset/test-dataset",
    })
  })

  it("creates resources with file uploads", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-1",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-1",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-2",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-2",
          },
        }),
    })

    await savePackageToCkan(mockPackage, mockOptions)

    const resourceCreateCall = fetchMock.mock.calls[1]
    expect(resourceCreateCall).toBeDefined()
    if (!resourceCreateCall) return

    expect(resourceCreateCall[0]).toEqual(
      "https://ckan.example.com/api/3/action/resource_create",
    )
    expect(resourceCreateCall[1]).toMatchObject({
      method: "POST",
      headers: {
        Authorization: "test-api-key",
      },
    })

    const formData = resourceCreateCall[1].body
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get("package_id")).toEqual("test-dataset")
    expect(formData.get("name")).toEqual("data.csv")
  })

  it("creates datapackage.json resource", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-1",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-1",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-2",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-2",
          },
        }),
    })

    await savePackageToCkan(mockPackage, mockOptions)

    const datapackageCreateCall = fetchMock.mock.calls[2]
    expect(datapackageCreateCall).toBeDefined()
    if (!datapackageCreateCall) return

    expect(datapackageCreateCall[0]).toEqual(
      "https://ckan.example.com/api/3/action/resource_create",
    )

    const formData = datapackageCreateCall[1].body
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get("package_id")).toEqual("test-dataset")
    expect(formData.get("name")).toEqual("datapackage.json")

    const uploadBlob = formData.get("upload")
    expect(uploadBlob).toBeInstanceOf(Blob)
  })

  it("handles API errors from package_create", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve("Invalid package data"),
    })

    await expect(savePackageToCkan(mockPackage, mockOptions)).rejects.toThrow(
      "CKAN API error: 400 Bad Request",
    )
  })

  it("handles API errors from resource_create", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve("Failed to create resource"),
    })

    await expect(savePackageToCkan(mockPackage, mockOptions)).rejects.toThrow(
      "CKAN API error: 500 Internal Server Error",
    )
  })

  it("handles CKAN API success: false responses", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: false,
          error: {
            message: "Package already exists",
          },
        }),
    })

    await expect(savePackageToCkan(mockPackage, mockOptions)).rejects.toThrow(
      "CKAN API error",
    )
  })

  it("handles packages with multiple resources", async () => {
    const multiResourcePackage: Package = {
      ...mockPackage,
      resources: [
        {
          name: "resource-1",
          path: getFixturePath("data.csv"),
          format: "csv",
        },
        {
          name: "resource-2",
          path: getFixturePath("data.csv"),
          format: "json",
        },
      ],
    }

    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    await savePackageToCkan(multiResourcePackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(4)

    const secondResourceCall = fetchMock.mock.calls[2]
    expect(secondResourceCall).toBeDefined()
    if (!secondResourceCall) return

    expect(secondResourceCall[0]).toEqual(
      "https://ckan.example.com/api/3/action/resource_create",
    )
  })

  it("handles packages with no resources", async () => {
    const emptyPackage: Package = {
      ...mockPackage,
      resources: [],
    }

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            name: "test-dataset",
            url: "https://ckan.example.com/dataset/test-dataset",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: {
            id: "resource-1",
            url: "https://ckan.example.com/dataset/test-dataset/resource/resource-1",
          },
        }),
    })

    const result = await savePackageToCkan(emptyPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.datasetUrl).toEqual(
      "https://ckan.example.com/dataset/test-dataset",
    )
  })

  it("passes API key in Authorization header", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          result: { name: "test-dataset" },
        }),
    })

    await savePackageToCkan(mockPackage, {
      ...mockOptions,
      apiKey: "custom-api-key",
    })

    const firstCall = fetchMock.mock.calls[0]
    expect(firstCall).toBeDefined()
    if (!firstCall) return

    const headers = firstCall[1].headers
    expect(headers.Authorization).toEqual("custom-api-key")
  })
})
