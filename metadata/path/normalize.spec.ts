import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"
import { normalizePath } from "./normalize.ts"

describe("normalizePath", () => {
  it.each([
    {
      description: "local path without basepath",
      path: "path/to/file.txt",
      basepath: undefined,
      normalizedPath: join("path", "to", "file.txt"),
    },
    {
      description: "local path with local basepath",
      path: "file.txt",
      basepath: "path/to",
      normalizedPath: join("path", "to", "file.txt"),
    },
    {
      description: "remote path",
      path: "http://example.com/path/to/file.txt",
      basepath: undefined,
      normalizedPath: "http://example.com/path/to/file.txt",
    },
    {
      description: "remote path with query string",
      path: "http://example.com/path/to/file.txt?query=param",
      basepath: undefined,
      normalizedPath: "http://example.com/path/to/file.txt?query=param",
    },
    {
      description: "local path with remote basepath",
      path: "path/to/file.txt",
      basepath: "http://example.com",
      normalizedPath: "http://example.com/path/to/file.txt",
    },
    {
      description: "local path with absolute basepath",
      path: "file.txt",
      basepath: "/absolute/path",
      normalizedPath: relative(process.cwd(), "/absolute/path/file.txt"),
    },
    {
      description: "path with empty basepath",
      path: "path/to/file.txt",
      basepath: "",
      normalizedPath: join("path", "to", "file.txt"),
    },
  ])("$description", ({ path, basepath, normalizedPath }) => {
    expect(normalizePath(path, { basepath })).toEqual(normalizedPath)
  })

  it.each([
    {
      description: "absolute path",
      path: "/absolute/path/to/file.txt",
      basepath: undefined,
    },
    {
      description: "local traversed path",
      path: "../file.txt",
      basepath: "/folder",
    },
    {
      description: "remote traversed path",
      path: "../file.txt",
      basepath: "http://example.com/data",
    },
  ])("$description -- throw", ({ path, basepath }) => {
    expect(() => normalizePath(path, { basepath })).toThrow()
  })
})
