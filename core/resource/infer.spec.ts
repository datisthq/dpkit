import { describe, expect, it } from "vitest"
import { inferResourceFormat, inferResourceName } from "./infer.ts"

describe("inferResourceName", () => {
  it("returns existing name when provided", () => {
    const resource = { name: "existing-name" }
    expect(inferResourceName(resource)).toBe("existing-name")
  })

  it("infers name from single string path", () => {
    const resource = { path: "/data/users.csv" }
    expect(inferResourceName(resource)).toBe("users")
  })

  it("infers name from first path in array", () => {
    const resource = { path: ["/data/users.csv", "/data/backup.csv"] }
    expect(inferResourceName(resource)).toBe("users")
  })

  it("infers name from URL path", () => {
    const resource = { path: "https://example.com/data/products.json" }
    expect(inferResourceName(resource)).toBe("products")
  })

  it("returns default name when no path or name", () => {
    const resource = {}
    expect(inferResourceName(resource)).toBe("resource")
  })

  it("returns default name when path has no filename", () => {
    const resource = { path: "/data/folder/" }
    expect(inferResourceName(resource)).toBe("resource")
  })

  it("handles complex filename with multiple dots", () => {
    const resource = { path: "/data/file.backup.csv" }
    expect(inferResourceName(resource)).toBe("file")
  })

  it("slugifies filename with spaces and special characters", () => {
    const resource = { path: "/data/My Data File!.csv" }
    expect(inferResourceName(resource)).toBe("my-data-file")
  })
})

describe("inferResourceFormat", () => {
  it("returns existing format when provided", () => {
    const resource = { format: "json" }
    expect(inferResourceFormat(resource)).toBe("json")
  })

  it("infers format from single string path", () => {
    const resource = { path: "/data/users.csv" }
    expect(inferResourceFormat(resource)).toBe("csv")
  })

  it("infers format from first path in array", () => {
    const resource = { path: ["/data/users.xlsx", "/data/backup.csv"] }
    expect(inferResourceFormat(resource)).toBe("xlsx")
  })

  it("infers format from URL path", () => {
    const resource = { path: "https://example.com/data/products.json" }
    expect(inferResourceFormat(resource)).toBe("json")
  })

  it("returns lowercase format", () => {
    const resource = { path: "/data/file.CSV" }
    expect(inferResourceFormat(resource)).toBe("csv")
  })

  it("handles multiple extensions", () => {
    const resource = { path: "/data/file.tar.gz" }
    expect(inferResourceFormat(resource)).toBe("gz")
  })

  it("returns undefined when no path", () => {
    const resource = {}
    expect(inferResourceFormat(resource)).toBeUndefined()
  })

  it("returns undefined when path has no extension", () => {
    const resource = { path: "/data/file" }
    expect(inferResourceFormat(resource)).toBeUndefined()
  })

  it("returns undefined when filename cannot be determined", () => {
    const resource = { path: "/data/folder/" }
    expect(inferResourceFormat(resource)).toBeUndefined()
  })

  it("infers postgresql protocol from connection string", () => {
    const resource = {
      path: "postgresql://user:password@localhost:5432/database",
    }
    expect(inferResourceFormat(resource)).toBe("postgresql")
  })

  it("infers mysql protocol from connection string", () => {
    const resource = { path: "mysql://user:password@localhost:3306/database" }
    expect(inferResourceFormat(resource)).toBe("mysql")
  })

  it("infers sqlite protocol from file path", () => {
    const resource = { path: "sqlite:///path/to/database.db" }
    expect(inferResourceFormat(resource)).toBe("sqlite")
  })

  it("infers sqlite protocol with file scheme", () => {
    const resource = { path: "sqlite://localhost/path/to/database.db" }
    expect(inferResourceFormat(resource)).toBe("sqlite")
  })

  it("handles postgres protocol with ssl parameters", () => {
    const resource = {
      path: "postgresql://user:pass@host:5432/db?sslmode=require",
    }
    expect(inferResourceFormat(resource)).toBe("postgresql")
  })

  it("handles mysql protocol with options", () => {
    const resource = { path: "mysql://user:pass@host:3306/db?charset=utf8" }
    expect(inferResourceFormat(resource)).toBe("mysql")
  })
})
