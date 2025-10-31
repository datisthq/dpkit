import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { getBasepath } from "./basepath.ts"

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
      basepath: join("some", "path", "to"),
    },
    {
      description: "local path with no file",
      path: "some/path/to/",
      basepath: join("some", "path"),
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
