import { describe, expect, it } from "vitest"
import { getCommonLocalBasepath } from "./path.ts"

describe("getCommonLocalBasepath", () => {
  it.each([
    {
      description: "same directory different files",
      paths: ["data/table1.csv", "data/table2.csv"],
      basepath: "data",
    },
    {
      description: "nested directories",
      paths: [
        "data/nested/file1.csv",
        "data/nested/file2.csv",
        "data/file3.csv",
      ],
      basepath: "data",
    },
    {
      description: "single path",
      paths: ["data/file.csv"],
      basepath: "data",
    },
    {
      description: "root level files",
      paths: ["file1.csv", "file2.csv"],
      basepath: "",
    },
    {
      description: "different top-level directories",
      paths: ["data1/file1.csv", "data2/file2.csv"],
      basepath: "",
    },
    {
      description: "empty paths array",
      paths: [],
      basepath: undefined,
    },
    {
      description: "some path are remote",
      paths: ["https://example.com/table.csv", "data/table.csv"],
      basepath: "data",
    },
    {
      description: "all paths are remote",
      paths: [
        "https://example.com/table1.csv",
        "https://example.com/table2.csv",
      ],
      basepath: undefined,
    },
  ])("$description", ({ paths, basepath }) => {
    expect(getCommonLocalBasepath(paths)).toEqual(basepath)
  })
})
