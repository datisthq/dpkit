import { describe, expect, it } from "vitest"
import { getFilename, isRemotePath } from "./path.js"

describe("isRemotePath", () => {
  it.each([
    {
      description: "http URL",
      path: "http://example.com/path/to/file.txt",
      expected: true,
    },
    {
      description: "https URL",
      path: "https://example.com/path/to/file.txt",
      expected: true,
    },
    {
      description: "ftp URL",
      path: "ftp://example.com/path/to/file.txt",
      expected: true,
    },
    {
      description: "file URL",
      path: "file:///path/to/file.txt",
      expected: true,
    },
    {
      description: "absolute path",
      path: "/path/to/file.txt",
      expected: false,
    },
    {
      description: "relative path",
      path: "path/to/file.txt",
      expected: false,
    },
    {
      description: "current directory path",
      path: "./file.txt",
      expected: false,
    },
    {
      description: "parent directory path",
      path: "../file.txt",
      expected: false,
    },
    {
      description: "empty string",
      path: "",
      expected: false,
    },
    {
      // new URL considers this to be a valid URL
      description: "protocol without slashes",
      path: "http:example.com",
      expected: true,
    },
  ])("$description", ({ path, expected }) => {
    expect(isRemotePath({ path })).toBe(expected)
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
    expect(getFilename({ path })).toEqual(filename)
  })
})
