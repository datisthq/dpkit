import { describe, expect, it } from "vitest"
import { inferFormat, inferName } from "./infer.ts"

describe("inferName", () => {
  it("returns existing name when provided", () => {
    const resource = { name: "existing-name" }
    expect(inferName(resource)).toBe("existing-name")
  })

  it("infers name from single string path", () => {
    const resource = { path: "/data/users.csv" }
    expect(inferName(resource)).toBe("users")
  })

  it("infers name from first path in array", () => {
    const resource = { path: ["/data/users.csv", "/data/backup.csv"] }
    expect(inferName(resource)).toBe("users")
  })

  it("infers name from URL path", () => {
    const resource = { path: "https://example.com/data/products.json" }
    expect(inferName(resource)).toBe("products")
  })

  it("returns default name when no path or name", () => {
    const resource = {}
    expect(inferName(resource)).toBe("resource")
  })

  it("returns default name when path has no filename", () => {
    const resource = { path: "/data/folder/" }
    expect(inferName(resource)).toBe("resource")
  })

  it("handles complex filename with multiple dots", () => {
    const resource = { path: "/data/file.backup.csv" }
    expect(inferName(resource)).toBe("file")
  })

  it("slugifies filename with spaces and special characters", () => {
    const resource = { path: "/data/My Data File!.csv" }
    expect(inferName(resource)).toBe("my-data-file")
  })
})

describe("inferFormat", () => {
  it("returns existing format when provided", () => {
    const resource = { format: "json" }
    expect(inferFormat(resource)).toBe("json")
  })

  it("infers format from single string path", () => {
    const resource = { path: "/data/users.csv" }
    expect(inferFormat(resource)).toBe("csv")
  })

  it("infers format from first path in array", () => {
    const resource = { path: ["/data/users.xlsx", "/data/backup.csv"] }
    expect(inferFormat(resource)).toBe("xlsx")
  })

  it("infers format from URL path", () => {
    const resource = { path: "https://example.com/data/products.json" }
    expect(inferFormat(resource)).toBe("json")
  })

  it("returns lowercase format", () => {
    const resource = { path: "/data/file.CSV" }
    expect(inferFormat(resource)).toBe("csv")
  })

  it("handles multiple extensions", () => {
    const resource = { path: "/data/file.tar.gz" }
    expect(inferFormat(resource)).toBe("gz")
  })

  it("returns undefined when no path", () => {
    const resource = {}
    expect(inferFormat(resource)).toBeUndefined()
  })

  it("returns undefined when path has no extension", () => {
    const resource = { path: "/data/file" }
    expect(inferFormat(resource)).toBeUndefined()
  })

  it("returns undefined when filename cannot be determined", () => {
    const resource = { path: "/data/folder/" }
    expect(inferFormat(resource)).toBeUndefined()
  })

  it("infers postgresql protocol from connection string", () => {
    const resource = {
      path: "postgresql://user:password@localhost:5432/database",
    }
    expect(inferFormat(resource)).toBe("postgresql")
  })

  it("infers mysql protocol from connection string", () => {
    const resource = { path: "mysql://user:password@localhost:3306/database" }
    expect(inferFormat(resource)).toBe("mysql")
  })

  it("infers sqlite protocol from file path", () => {
    const resource = { path: "sqlite:///path/to/database.db" }
    expect(inferFormat(resource)).toBe("sqlite")
  })

  it("infers sqlite protocol with file scheme", () => {
    const resource = { path: "sqlite://localhost/path/to/database.db" }
    expect(inferFormat(resource)).toBe("sqlite")
  })

  it("handles postgres protocol with ssl parameters", () => {
    const resource = {
      path: "postgresql://user:pass@host:5432/db?sslmode=require",
    }
    expect(inferFormat(resource)).toBe("postgresql")
  })

  it("handles mysql protocol with options", () => {
    const resource = { path: "mysql://user:pass@host:3306/db?charset=utf8" }
    expect(inferFormat(resource)).toBe("mysql")
  })
})
