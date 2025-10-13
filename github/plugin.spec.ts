import type { Package } from "@dpkit/core"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/load.ts"
import { GithubPlugin } from "./plugin.ts"

vi.mock("./package/load.ts", () => ({
  loadPackageFromGithub: vi.fn(),
}))

describe("GithubPlugin", () => {
  let plugin: GithubPlugin
  let mockLoadPackageFromGithub: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new GithubPlugin()
    mockLoadPackageFromGithub = vi.mocked(packageModule.loadPackageFromGithub)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from github.com url", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromGithub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://github.com/owner/repo/data",
      )

      expect(mockLoadPackageFromGithub).toHaveBeenCalledWith(
        "https://github.com/owner/repo/data",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for non-github urls", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromGithub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local paths", async () => {
      const result = await plugin.loadPackage("./data")

      expect(mockLoadPackageFromGithub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for zenodo urls", async () => {
      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageFromGithub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle github urls with paths", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromGithub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://github.com/owner/repo/tree/main/data",
      )

      expect(mockLoadPackageFromGithub).toHaveBeenCalledWith(
        "https://github.com/owner/repo/tree/main/data",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle github urls with query parameters", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromGithub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://github.com/owner/repo?tab=readme",
      )

      expect(mockLoadPackageFromGithub).toHaveBeenCalledWith(
        "https://github.com/owner/repo?tab=readme",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for http non-github urls", async () => {
      const result = await plugin.loadPackage("http://example.com/data")

      expect(mockLoadPackageFromGithub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for gitlab urls", async () => {
      const result = await plugin.loadPackage("https://gitlab.com/owner/repo")

      expect(mockLoadPackageFromGithub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
