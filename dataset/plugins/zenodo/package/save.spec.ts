import { relative } from "node:path"
import type { Package } from "@dpkit/metadata"
import { loadPackageDescriptor } from "@dpkit/metadata"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { savePackageToZenodo } from "./save.ts"

describe("savePackageToZenodo", () => {
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
    sandbox: true,
  }

  const originalFetch = globalThis.fetch
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
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

    const result = await savePackageToZenodo(dataPackage, {
      apiKey: "<key>",
      sandbox: true,
    })

    expect(result).toBeDefined()
  })

  it("creates a deposition in Zenodo with correct API calls", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "data.csv",
          filesize: 100,
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-2",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    const result = await savePackageToZenodo(mockPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(3)

    const depositionCreateCall = fetchMock.mock.calls[0]
    expect(depositionCreateCall).toBeDefined()
    if (!depositionCreateCall) return

    expect(depositionCreateCall[0]).toContain(
      "https://sandbox.zenodo.org/api/deposit/depositions",
    )
    expect(depositionCreateCall[0]).toContain("access_token=test-api-key")
    expect(depositionCreateCall[1]).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const depositionPayload = JSON.parse(depositionCreateCall[1].body)
    expect(depositionPayload.metadata.title).toEqual("Test Package")
    expect(depositionPayload.metadata.description).toEqual("A test package")

    expect(result).toEqual({
      path: "https://sandbox.zenodo.org/records/12345/files/datapackage.json",
      datasetUrl: "https://sandbox.zenodo.org/uploads/12345",
    })
  })

  it("uploads resource files to deposition", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "data.csv",
          filesize: 100,
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-2",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    await savePackageToZenodo(mockPackage, mockOptions)

    const fileUploadCall = fetchMock.mock.calls[1]
    expect(fileUploadCall).toBeDefined()
    if (!fileUploadCall) return

    expect(fileUploadCall[0]).toContain(
      "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
    )
    expect(fileUploadCall[0]).toContain("access_token=test-api-key")
    expect(fileUploadCall[1]).toMatchObject({
      method: "POST",
    })

    const formData = fileUploadCall[1].body
    expect(formData).toBeInstanceOf(FormData)
  })

  it("uploads datapackage.json metadata file", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "data.csv",
          filesize: 100,
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-2",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    await savePackageToZenodo(mockPackage, mockOptions)

    const datapackageUploadCall = fetchMock.mock.calls[2]
    expect(datapackageUploadCall).toBeDefined()
    if (!datapackageUploadCall) return

    expect(datapackageUploadCall[0]).toContain(
      "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
    )

    const formData = datapackageUploadCall[1].body
    expect(formData).toBeInstanceOf(FormData)

    const fileBlob = formData.get("file")
    expect(fileBlob).toBeInstanceOf(Blob)
  })

  it("uses production API when sandbox is false", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://zenodo.org/api/deposit/depositions/12345",
            html: "https://zenodo.org/deposit/12345",
            files: "https://zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "data.csv",
        }),
    })

    await savePackageToZenodo(mockPackage, {
      apiKey: "test-api-key",
      sandbox: false,
    })

    const depositionCreateCall = fetchMock.mock.calls[0]
    expect(depositionCreateCall).toBeDefined()
    if (!depositionCreateCall) return

    expect(depositionCreateCall[0]).toContain("https://zenodo.org/api")
    expect(depositionCreateCall[0]).not.toContain("sandbox")
  })

  it("passes API key as access_token query parameter", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    await savePackageToZenodo(mockPackage, {
      apiKey: "custom-api-key",
      sandbox: true,
    })

    const depositionCreateCall = fetchMock.mock.calls[0]
    expect(depositionCreateCall).toBeDefined()
    if (!depositionCreateCall) return

    expect(depositionCreateCall[0]).toContain("access_token=custom-api-key")
  })

  it("handles API errors from deposition creation", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve("Invalid deposition data"),
    })

    await expect(savePackageToZenodo(mockPackage, mockOptions)).rejects.toThrow(
      "Zenodo API error: 400 Bad Request",
    )
  })

  it("handles API errors from file upload", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve("Failed to upload file"),
    })

    await expect(savePackageToZenodo(mockPackage, mockOptions)).rejects.toThrow(
      "Zenodo API error: 500 Internal Server Error",
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
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    await savePackageToZenodo(multiResourcePackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(4)

    const secondFileUploadCall = fetchMock.mock.calls[2]
    expect(secondFileUploadCall).toBeDefined()
    if (!secondFileUploadCall) return

    expect(secondFileUploadCall[0]).toContain("/files")
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
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    const result = await savePackageToZenodo(emptyPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.datasetUrl).toEqual(
      "https://sandbox.zenodo.org/uploads/12345",
    )
  })

  it("skips resources without path", async () => {
    const packageWithoutPath: Package = {
      ...mockPackage,
      resources: [
        {
          name: "resource-without-path",
          format: "csv",
        },
      ],
    }

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    await savePackageToZenodo(packageWithoutPath, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("includes contributors with author role as creators in metadata", async () => {
    const packageWithContributors: Package = {
      ...mockPackage,
      contributors: [
        {
          title: "Alice Smith",
          role: "author",
          path: "University of Example",
        },
        {
          title: "Bob Jones",
          role: "author",
          path: "Institute of Testing",
        },
        {
          title: "Charlie Brown",
          role: "contributor",
        },
      ],
    }

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          links: {
            self: "https://sandbox.zenodo.org/api/deposit/depositions/12345",
            html: "https://sandbox.zenodo.org/deposit/12345",
            files:
              "https://sandbox.zenodo.org/api/deposit/depositions/12345/files",
            bucket: "https://sandbox.zenodo.org/api/files/bucket-id",
          },
          metadata: {
            title: "Test Package",
            description: "A test package",
            upload_type: "dataset",
            creators: [
              {
                name: "Alice Smith",
                affiliation: "University of Example",
              },
              {
                name: "Bob Jones",
                affiliation: "Institute of Testing",
              },
            ],
          },
          state: "unsubmitted",
          submitted: false,
          files: [],
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-1",
          filename: "data.csv",
          filesize: 100,
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "file-2",
          filename: "datapackage.json",
          filesize: 500,
        }),
    })

    await savePackageToZenodo(packageWithContributors, mockOptions)

    const depositionCreateCall = fetchMock.mock.calls[0]
    expect(depositionCreateCall).toBeDefined()
    if (!depositionCreateCall) return

    const depositionPayload = JSON.parse(depositionCreateCall[1].body)
    expect(depositionPayload.metadata.creators).toEqual([
      {
        name: "Alice Smith",
        affiliation: "University of Example",
      },
      {
        name: "Bob Jones",
        affiliation: "Institute of Testing",
      },
    ])
  })
})
