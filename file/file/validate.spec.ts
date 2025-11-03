import { beforeEach, describe, expect, it, vi } from "vitest"
import * as fetchModule from "./fetch.ts"
import { inferFileHash } from "./infer.ts"
import { writeTempFile } from "./temp.ts"
import { validateFile } from "./validate.ts"

vi.mock("./fetch.ts", () => ({
  prefetchFiles: vi.fn(),
}))

describe("validateFile", () => {
  let mockPrefetchFiles: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPrefetchFiles = vi.mocked(fetchModule.prefetchFiles)
    vi.clearAllMocks()
  })

  it("should return valid report when no validation options provided", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("https://example.com/file.txt")

    expect(mockPrefetchFiles).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate bytes successfully when they match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 13,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return error when bytes do not match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 1024,
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]).toEqual({
      type: "file/bytes",
      bytes: 1024,
      actualBytes: 13,
    })
  })

  it("should validate hash successfully when it matches", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "md5" })

    const report = await validateFile("https://example.com/file.txt", {
      hash: actualHash,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return error when hash does not match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "md5" })

    const report = await validateFile("https://example.com/file.txt", {
      hash: "md5:wronghash",
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]).toEqual({
      type: "file/hash",
      hash: "md5:wronghash",
      actualHash,
    })
  })

  it("should validate sha256 hash", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "sha256" })

    const report = await validateFile("https://example.com/file.txt", {
      hash: actualHash,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate sha1 hash", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "sha1" })

    const report = await validateFile("https://example.com/file.txt", {
      hash: actualHash,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate sha512 hash", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "sha512" })

    const report = await validateFile("https://example.com/file.txt", {
      hash: actualHash,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate both bytes and hash when both match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "md5" })

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 13,
      hash: actualHash,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return multiple errors when both bytes and hash do not match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "md5" })

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 1024,
      hash: "md5:wronghash",
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(2)
    expect(report.errors[0]).toEqual({
      type: "file/bytes",
      bytes: 1024,
      actualBytes: 13,
    })
    expect(report.errors[1]).toEqual({
      type: "file/hash",
      hash: "md5:wronghash",
      actualHash,
    })
  })

  it("should return error when only bytes mismatch", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferFileHash(tempFilePath, { hashType: "md5" })

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 1024,
      hash: actualHash,
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]?.type).toBe("file/bytes")
  })

  it("should return error when only hash mismatch", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("https://example.com/file.txt", {
      bytes: 13,
      hash: "md5:wronghash",
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]?.type).toBe("file/hash")
  })

  it("should handle local file paths", async () => {
    const tempFilePath = await writeTempFile("x".repeat(2048))
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("/local/path/file.txt", { bytes: 2048 })

    expect(mockPrefetchFiles).toHaveBeenCalledWith("/local/path/file.txt")
    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should handle empty file validation", async () => {
    const tempFilePath = await writeTempFile("")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile("https://example.com/empty.txt", {
      bytes: 0,
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })
})
