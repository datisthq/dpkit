import { relative } from "node:path"
import type { Package } from "@dpkit/metadata"
import { loadPackageDescriptor } from "@dpkit/metadata"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { savePackageToGithub } from "./save.ts"

describe("savePackageToGithub", () => {
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
    repo: "test-repo",
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

    const result = await savePackageToGithub(dataPackage, {
      apiKey: "<key>",
      repo: "test",
    })

    console.log(result)

    expect(true).toBeDefined()
  })

  it("creates a repository in GitHub with correct API calls", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "data.csv",
            path: "data.csv",
            sha: "abc123",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "datapackage.json",
            path: "datapackage.json",
            sha: "def456",
          },
        }),
    })

    const result = await savePackageToGithub(mockPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(3)

    const repoCreateCall = fetchMock.mock.calls[0]
    expect(repoCreateCall).toBeDefined()
    if (!repoCreateCall) return

    expect(repoCreateCall[0]).toEqual("https://api.github.com/user/repos")
    expect(repoCreateCall[1]).toMatchObject({
      method: "POST",
      headers: {
        Authorization: "Bearer test-api-key",
        "Content-Type": "application/json",
      },
    })

    const repoPayload = JSON.parse(repoCreateCall[1].body)
    expect(repoPayload.name).toEqual("test-repo")
    expect(repoPayload.auto_init).toEqual(true)

    expect(result).toEqual({
      path: "https://raw.githubusercontent.com/test-user/test-repo/refs/heads/main/dataPackage.json",
      repoUrl: "https://github.com/test-user/test-repo",
    })
  })

  it("creates a repository in an organization when org is specified", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          full_name: "test-org/test-repo",
          owner: {
            login: "test-org",
            id: 2,
            avatar_url: "https://avatars.githubusercontent.com/u/2",
            html_url: "https://github.com/test-org",
            type: "Organization",
          },
          html_url: "https://github.com/test-org/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-org/test-repo.git",
          ssh_url: "git@github.com:test-org/test-repo.git",
          clone_url: "https://github.com/test-org/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "file",
            path: "file",
            sha: "abc123",
          },
        }),
    })

    await savePackageToGithub(mockPackage, {
      ...mockOptions,
      org: "test-org",
    })

    const repoCreateCall = fetchMock.mock.calls[0]
    expect(repoCreateCall).toBeDefined()
    if (!repoCreateCall) return

    expect(repoCreateCall[0]).toEqual(
      "https://api.github.com/orgs/test-org/repos",
    )
  })

  it("uploads resource files with base64 encoding", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "data.csv",
            path: "data.csv",
            sha: "abc123",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "datapackage.json",
            path: "datapackage.json",
            sha: "def456",
          },
        }),
    })

    await savePackageToGithub(mockPackage, mockOptions)

    const fileUploadCall = fetchMock.mock.calls[1]
    expect(fileUploadCall).toBeDefined()
    if (!fileUploadCall) return

    expect(fileUploadCall[0]).toEqual(
      "https://api.github.com/repos/test-user/test-repo/contents/data.csv",
    )
    expect(fileUploadCall[1]).toMatchObject({
      method: "PUT",
      headers: {
        Authorization: "Bearer test-api-key",
        "Content-Type": "application/json",
      },
    })

    const filePayload = JSON.parse(fileUploadCall[1].body)
    expect(filePayload.path).toEqual("data.csv")
    expect(filePayload.message).toEqual('Added file "data.csv"')
    expect(filePayload.content).toBeDefined()
    expect(typeof filePayload.content).toEqual("string")
  })

  it("uploads datapackage.json metadata file", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "data.csv",
            path: "data.csv",
            sha: "abc123",
          },
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "datapackage.json",
            path: "datapackage.json",
            sha: "def456",
          },
        }),
    })

    await savePackageToGithub(mockPackage, mockOptions)

    const datapackageUploadCall = fetchMock.mock.calls[2]
    expect(datapackageUploadCall).toBeDefined()
    if (!datapackageUploadCall) return

    expect(datapackageUploadCall[0]).toEqual(
      "https://api.github.com/repos/test-user/test-repo/contents/datapackage.json",
    )

    const datapackagePayload = JSON.parse(datapackageUploadCall[1].body)
    expect(datapackagePayload.path).toEqual("datapackage.json")
    expect(datapackagePayload.message).toEqual('Added file "datapackage.json"')
    expect(datapackagePayload.content).toBeDefined()
    expect(typeof datapackagePayload.content).toEqual("string")
  })

  it("passes API key as Bearer token in Authorization header", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    await savePackageToGithub(mockPackage, {
      ...mockOptions,
      apiKey: "custom-api-key",
    })

    const firstCall = fetchMock.mock.calls[0]
    expect(firstCall).toBeDefined()
    if (!firstCall) return

    const headers = firstCall[1].headers
    expect(headers.Authorization).toEqual("Bearer custom-api-key")
  })

  it("handles API errors from repository creation", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.resolve("Repository name already exists"),
    })

    await expect(savePackageToGithub(mockPackage, mockOptions)).rejects.toThrow(
      "Github API error: 400 Bad Request",
    )
  })

  it("handles API errors from file upload", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 12345,
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve("Failed to upload file"),
    })

    await expect(savePackageToGithub(mockPackage, mockOptions)).rejects.toThrow(
      "Github API error: 500 Internal Server Error",
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
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    await savePackageToGithub(multiResourcePackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(4)

    const secondFileUploadCall = fetchMock.mock.calls[2]
    expect(secondFileUploadCall).toBeDefined()
    if (!secondFileUploadCall) return

    expect(secondFileUploadCall[0]).toContain("/contents/")
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
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "datapackage.json",
            path: "datapackage.json",
            sha: "def456",
          },
        }),
    })

    const result = await savePackageToGithub(emptyPackage, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.repoUrl).toEqual("https://github.com/test-user/test-repo")
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
          name: "test-repo",
          full_name: "test-user/test-repo",
          owner: {
            login: "test-user",
            id: 1,
            avatar_url: "https://avatars.githubusercontent.com/u/1",
            html_url: "https://github.com/test-user",
            type: "User",
          },
          html_url: "https://github.com/test-user/test-repo",
          description: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          license: null,
          default_branch: "main",
          topics: [],
          private: false,
          archived: false,
          git_url: "git://github.com/test-user/test-repo.git",
          ssh_url: "git@github.com:test-user/test-repo.git",
          clone_url: "https://github.com/test-user/test-repo.git",
        }),
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: {
            name: "datapackage.json",
            path: "datapackage.json",
            sha: "def456",
          },
        }),
    })

    await savePackageToGithub(packageWithoutPath, mockOptions)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
