import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { exploreDialectCommand } from "./explore.tsx"

vi.mock("../../components/Dialect/Dialect.tsx", () => ({
  Dialect: vi.fn(() => null),
}))

describe("dialect explore", () => {
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

  it("should call session methods when exploring a dialect", async () => {
    const dialectDescriptor = JSON.stringify({
      delimiter: ",",
      lineTerminator: "\n",
    })
    const descriptorPath = await writeTempFile(dialectDescriptor)

    const command = new Command()
      .addCommand(exploreDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should handle dialect with various properties", async () => {
    const dialectDescriptor = JSON.stringify({
      delimiter: "|",
      lineTerminator: "\r\n",
      quoteChar: '"',
      doubleQuote: true,
      skipInitialSpace: false,
    })
    const descriptorPath = await writeTempFile(dialectDescriptor)

    const command = new Command()
      .addCommand(exploreDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should handle json output option", async () => {
    const dialectDescriptor = JSON.stringify({
      delimiter: ",",
      lineTerminator: "\n",
    })
    const descriptorPath = await writeTempFile(dialectDescriptor)

    const command = new Command()
      .addCommand(exploreDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "explore",
        descriptorPath,
        "--json",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })

  it("should handle dialect with header configuration", async () => {
    const dialectDescriptor = JSON.stringify({
      delimiter: "\t",
      lineTerminator: "\n",
      header: true,
    })
    const descriptorPath = await writeTempFile(dialectDescriptor)

    const command = new Command()
      .addCommand(exploreDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "explore", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
    expect(mockRender).toHaveBeenCalled()
  })
})
