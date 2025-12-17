import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { explorePackageCommand } from "./explore.tsx"

vi.mock("../../components/Package/Package.tsx", () => ({
  Package: vi.fn(() => null),
}))

describe("package explore", () => {
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

  it("should call session methods when exploring a package", async () => {
    const packageDescriptor = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: "data.csv",
        },
      ],
    })
    const descriptorPath = await writeTempFile(packageDescriptor)

    const command = new Command()
      .addCommand(explorePackageCommand)
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

  it("should handle package with multiple resources", async () => {
    const packageDescriptor = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "resource1",
          path: "data1.csv",
        },
        {
          name: "resource2",
          path: "data2.json",
          format: "json",
        },
      ],
    })
    const descriptorPath = await writeTempFile(packageDescriptor)

    const command = new Command()
      .addCommand(explorePackageCommand)
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
    const packageDescriptor = JSON.stringify({
      name: "test-package",
      resources: [],
    })
    const descriptorPath = await writeTempFile(packageDescriptor)

    const command = new Command()
      .addCommand(explorePackageCommand)
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

  it("should handle package with metadata", async () => {
    const packageDescriptor = JSON.stringify({
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      version: "1.0.0",
      resources: [
        {
          name: "test-resource",
          path: "data.csv",
        },
      ],
    })
    const descriptorPath = await writeTempFile(packageDescriptor)

    const command = new Command()
      .addCommand(explorePackageCommand)
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
