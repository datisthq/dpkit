import { describe, expect, it } from "vitest"
import { denormalizePath } from "./denormalize.ts"

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
