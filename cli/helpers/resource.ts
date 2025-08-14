import { loadPackage } from "dpkit"
import { Session } from "./session.ts"

export async function selectResource(
  session: Session,
  options: { package?: string; resource?: string },
) {
  if (!options.package) {
    Session.terminate("Please provide a path argument or a package option")
  }

  const dataPackage = await session.task(
    "Loading package",
    loadPackage(options.package),
  )

  const resourceName =
    options.resource ??
    (await session.select({
      message: "Select resource",
      options: dataPackage.resources.map(resource => ({
        label: resource.name,
        value: resource.name,
      })),
    }))

  const resource = dataPackage.resources.find(
    resource => resource.name === resourceName,
  )

  if (!resource) {
    Session.terminate(
      `Resource "${resourceName}" is not found in the provided data package`,
    )
  }

  return resource
}
