import type { Package } from "./Package.js"
import { loadPackageDescriptor } from "./load.js"

// TODO: rebase on receiving systemPackage/userPackage?

/**
 * If a data package contains an inner `datapackage.json`
 * (usually a system data package e.g. from CKAN contains a user package)
 * we rebase on the inner package and ehance it with the system metadata
 */
export async function mergePackage(props: { datapackage: Package }) {
  const systemPackage = props.datapackage

  const userPackagePath = props.datapackage.resources.filter(
    resource => resource["dpkit:isUserPackage"],
  )[0]?.path

  if (typeof userPackagePath !== "string") {
    return props.datapackage
  }

  const userPackage = await loadPackageDescriptor({ path: userPackagePath })

  return {
    ...systemPackage,
    resources: userPackage.resources,
  }
}
