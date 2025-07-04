import { relative } from "node:path"
import { describe, expect, it } from "vitest"
import {
  denormalizePath,
  getBasepath,
  getFilename,
  isRemotePath,
  normalizePath,
} from "./path.js"

describe("isRemotePath", () => {
  it.each([
    {
      description: "http URL",
      path: "http://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "https URL",
      path: "https://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "ftp URL",
      path: "ftp://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "file URL",
      path: "file:///path/to/file.txt",
      isRemote: true,
    },
    {
      description: "absolute path",
      path: "/path/to/file.txt",
      isRemote: false,
    },
    {
      description: "relative path",
      path: "path/to/file.txt",
      isRemote: false,
    },
    {
      description: "current directory path",
      path: "./file.txt",
      isRemote: false,
    },
    {
      description: "parent directory path",
      path: "../file.txt",
      isRemote: false,
    },
    {
      description: "empty string",
      path: "",
      isRemote: false,
    },
    {
      // new URL considers this to be a valid URL
      description: "protocol without slashes",
      path: "http:example.com",
      isRemote: true,
    },
  ])("$description", ({ path, isRemote }) => {
    expect(isRemotePath(path)).toBe(isRemote)
  })
})

describe("getFilename", () => {
  it.each([
    {
      description: "simple filename",
      path: "file.txt",
      filename: "file.txt",
    },
    {
      description: "directory path with filename",
      path: "some/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "remote HTTP URL",
      path: "http://example.com/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "remote HTTPS URL",
      path: "https://example.com/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "URL with query parameters",
      path: "https://example.com/path/to/file.txt?query=param",
      filename: "file.txt",
    },
    {
      description: "URL with hash",
      path: "https://example.com/path/to/file.txt#section",
      filename: "file.txt",
    },
    {
      description: "URL with query and hash",
      path: "https://example.com/path/to/file.txt?query=param#section",
      filename: "file.txt",
    },
    {
      description: "URL with no filename",
      path: "https://example.com/path/",
      filename: undefined,
    },
    {
      description: "local path with no filename",
      path: "some/path/",
      filename: undefined,
    },
  ])("$description", ({ path, filename }) => {
    expect(getFilename(path)).toEqual(filename)
  })
})

describe("getBasepath", () => {
  it.each([
    {
      description: "http URL with file",
      path: "http://example.com/path/to/file.txt",
      basepath: "http://example.com/path/to",
    },
    {
      description: "https URL with file",
      path: "https://example.com/path/to/file.txt",
      basepath: "https://example.com/path/to",
    },
    {
      description: "URL with query parameters",
      path: "https://example.com/path/to/file.txt?query=param",
      basepath: "https://example.com/path/to",
    },
    {
      description: "URL with hash",
      path: "https://example.com/path/to/file.txt#section",
      basepath: "https://example.com/path/to",
    },
    {
      description: "URL with no file",
      path: "https://example.com/path/to/",
      basepath: "https://example.com/path/to",
    },
    {
      description: "URL with only domain",
      path: "https://example.com",
      basepath: "https://example.com",
    },
    {
      description: "local file path",
      path: "some/path/to/file.txt",
      basepath: "some/path/to",
    },
    {
      description: "local path with no file",
      path: "some/path/to/",
      basepath: "some/path",
    },
    {
      description: "root level file",
      path: "file.txt",
      basepath: "",
    },
  ])("$description", ({ path, basepath }) => {
    expect(getBasepath(path)).toEqual(basepath)
  })
})

describe("normalizePath", () => {
  it.each([
    {
      description: "local path without basepath",
      path: "path/to/file.txt",
      basepath: undefined,
      normalizedPath: "path/to/file.txt",
    },
    {
      description: "local path with local basepath",
      path: "file.txt",
      basepath: "path/to",
      normalizedPath: "path/to/file.txt",
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
      normalizedPath: "path/to/file.txt",
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

describe("denormalizePath", () => {
  it.each([
    {
      description: "remote URL without basepath",
      path: "http://example.com/path/to/file.txt",
      basepath: undefined,
      denormalizedPath: "http://example.com/path/to/file.txt",
    },
    {
      description: "remote URL with basepath",
      path: "http://example.com/path/to/file.txt",
      basepath: "data",
      denormalizedPath: "http://example.com/path/to/file.txt",
    },
    {
      description: "local file in subfolder",
      path: "/tmp/data/file.csv",
      basepath: "/tmp",
      denormalizedPath: "data/file.csv",
    },
    {
      description: "local file in direct child folder",
      path: "/tmp/file.csv",
      basepath: "/tmp",
      denormalizedPath: "file.csv",
    },
    {
      description: "local file with deeply nested basepath",
      path: "/tmp/data/nested/deep/file.csv",
      basepath: "/tmp/data/nested",
      denormalizedPath: "deep/file.csv",
    },
    {
      description: "local file with multi-level basepath",
      path: "/home/user/projects/data/file.csv",
      basepath: "/home/user/projects",
      denormalizedPath: "data/file.csv",
    },
  ])("$description", ({ path, basepath, denormalizedPath }) => {
    expect(denormalizePath(path, { basepath })).toEqual(denormalizedPath)
  })
})
