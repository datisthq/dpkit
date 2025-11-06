import { writeTempFile } from "@dpkit/dataset"
import { Command } from "commander"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { exploreTableCommand } from "./explore.tsx"

vi.mock("../../components/TableGrid.tsx", () => ({
  TableGrid: vi.fn(() => null),
}))

describe("table explore", () => {
  let mockRender: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRender = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(sessionModule.Session, "create").mockImplementation(() => {
      const session = {
        task: vi.fn(async (_message: string, promise: Promise<any>) => {
          try {
            return await promise
          } catch (error) {
            console.log(String(error))
            return undefined
          }
        }),
        render: mockRender,
        terminate: vi.fn((msg: string) => {
          throw new Error(msg)
        }),
      }
      return session as any
    })
  })

  it("should call session methods when exploring a csv table", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
    )

    const command = new Command()
      .addCommand(exploreTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", csvPath, "--quit"])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle custom delimiter option", async () => {
    const csvPath = await writeTempFile("id|name|value\n1|test|100\n2|demo|200")

    const command = new Command()
      .addCommand(exploreTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "explore",
        csvPath,
        "--delimiter",
        "|",
        "--quit",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle query option", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
    )

    const command = new Command()
      .addCommand(exploreTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "explore",
        csvPath,
        "--query",
        "SELECT * FROM self WHERE age > 25",
        "--quit",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })
})
