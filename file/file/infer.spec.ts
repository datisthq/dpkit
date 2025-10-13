import { beforeEach, describe, expect, it, vi } from "vitest"
import * as fetchModule from "./fetch.ts"
import { inferFileBytes, inferFileEncoding, inferFileHash } from "./infer.ts"
import { writeTempFile } from "./temp.ts"

vi.mock("./fetch.ts", () => ({
  prefetchFile: vi.fn(),
}))

describe("inferFileHash", () => {
  let mockPrefetchFile: ReturnType<typeof vi.fn>
  let tempFilePath: string

  beforeEach(async () => {
    mockPrefetchFile = vi.mocked(fetchModule.prefetchFile)
    tempFilePath = await writeTempFile("Hello, World!")
    vi.clearAllMocks()
  })

  it("should compute sha256 hash by default", async () => {
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileHash("https://example.com/file.txt")

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(result).toMatch(/^sha256:[a-f0-9]{64}$/)
  })

  it("should compute md5 hash when specified", async () => {
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileHash("https://example.com/file.txt", {
      hashType: "md5",
    })

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(result).toMatch(/^md5:[a-f0-9]{32}$/)
  })

  it("should compute sha1 hash when specified", async () => {
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileHash("https://example.com/file.txt", {
      hashType: "sha1",
    })

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(result).toMatch(/^sha1:[a-f0-9]{40}$/)
  })

  it("should compute sha512 hash when specified", async () => {
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileHash("https://example.com/file.txt", {
      hashType: "sha512",
    })

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(result).toMatch(/^sha512:[a-f0-9]{128}$/)
  })

  it("should compute consistent hashes for same content", async () => {
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result1 = await inferFileHash("https://example.com/file.txt")
    const result2 = await inferFileHash("https://example.com/file.txt")

    expect(result1).toBe(result2)
  })
})

describe("inferFileBytes", () => {
  let mockPrefetchFile: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPrefetchFile = vi.mocked(fetchModule.prefetchFile)
    vi.clearAllMocks()
  })

  it("should return file size in bytes", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileBytes("https://example.com/file.txt")

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.txt",
    )
    expect(result).toBe(13)
  })

  it("should handle empty files", async () => {
    const tempFilePath = await writeTempFile("")
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileBytes("https://example.com/empty.txt")

    expect(result).toBe(0)
  })

  it("should handle larger files", async () => {
    const tempFilePath = await writeTempFile("x".repeat(10000))
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileBytes("https://example.com/large.txt")

    expect(result).toBe(10000)
  })

  it("should handle binary data", async () => {
    const tempFilePath = await writeTempFile(
      Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    )
    mockPrefetchFile.mockResolvedValue(tempFilePath)

    const result = await inferFileBytes("https://example.com/file.bin")

    expect(mockPrefetchFile).toHaveBeenCalledWith(
      "https://example.com/file.bin",
    )
    expect(result).toBe(4)
  })
})

describe("inferFileEncoding", () => {
  it("should detect utf-8 encoding", async () => {
    const tempFilePath = await writeTempFile(
      "Hello, World! This is UTF-8 text.",
    )

    const result = await inferFileEncoding(tempFilePath)

    expect(result).toBeDefined()
    expect(["utf-8", "utf8", "ascii"]).toContain(result)
  })

  it("should return undefined for binary files", async () => {
    const tempFilePath = await writeTempFile(
      Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]),
    )

    const result = await inferFileEncoding(tempFilePath)

    expect(result).toBeUndefined()
  })

  it("should use custom sample bytes", async () => {
    const tempFilePath = await writeTempFile(
      "This is a test file with UTF-8 content.",
    )

    const result = await inferFileEncoding(tempFilePath, { sampleBytes: 20 })

    expect(result).toBeDefined()
  })

  it("should use custom confidence threshold", async () => {
    const tempFilePath = await writeTempFile("Sample text content")

    const result = await inferFileEncoding(tempFilePath, {
      confidencePercent: 50,
    })

    expect(result).toBeDefined()
  })

  it("should handle large text files", async () => {
    const tempFilePath = await writeTempFile("Hello World! ".repeat(1000))

    const result = await inferFileEncoding(tempFilePath)

    expect(result).toBeDefined()
    expect(["utf-8", "utf8", "ascii"]).toContain(result)
  })

  it("should return encoding in lowercase", async () => {
    const tempFilePath = await writeTempFile(
      "Test content for encoding detection",
    )

    const result = await inferFileEncoding(tempFilePath)

    if (result) {
      expect(result).toBe(result.toLowerCase())
    }
  })

  it("should handle empty files", async () => {
    const tempFilePath = await writeTempFile("")

    const result = await inferFileEncoding(tempFilePath)

    expect([undefined, "utf-8", "utf8", "ascii"]).toContain(result)
  })

  it("should handle files with special characters", async () => {
    const tempFilePath = await writeTempFile("Special: é, ñ, ü, ö, à")

    const result = await inferFileEncoding(tempFilePath)

    expect(result).toBeDefined()
  })

  it("should detect encoding with low confidence threshold", async () => {
    const tempFilePath = await writeTempFile("Simple text")

    const result = await inferFileEncoding(tempFilePath, {
      confidencePercent: 30,
    })

    expect(result).toBeDefined()
  })
})
