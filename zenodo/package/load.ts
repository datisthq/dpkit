import { makeZenodoApiRequest } from "../general/index.js"
import type { ZenodoDeposit } from "./Deposit.js"
import { normalizeZenodoDeposit } from "./process/normalize.js"

/**
 * Load a package from a Zenodo deposit
 * @param props Object containing the URL to the Zenodo deposit
 * @returns Package object
 */
export async function loadPackageFromZenodo(props: {
  depositUrl: string
  apiKey?: string
  sandbox?: boolean
}) {
  const { depositUrl, apiKey, sandbox = false } = props

  const depositId = extractDepositId({ depositUrl })
  if (!depositId) {
    throw new Error(`Failed to extract deposit ID from URL: ${depositUrl}`)
  }

  const zenodoDeposit = await loadZenodoDeposit({
    depositId,
    apiKey,
    sandbox,
  })

  const datapackage = normalizeZenodoDeposit({ zenodoDeposit })
  return datapackage
}

/**
 * Extract deposit ID from URL
 *
 * Examples:
 * - https://zenodo.org/record/1234567
 * - https://zenodo.org/records/1234567
 * - https://sandbox.zenodo.org/record/1234567
 */
function extractDepositId(props: { depositUrl: string }): string | undefined {
  try {
    const url = new URL(props.depositUrl)
    const pathParts = url.pathname.split("/").filter(Boolean)

    // Handle both /record/ID and /records/ID formats
    if (
      pathParts.length >= 2 &&
      (pathParts[0] === "record" || pathParts[0] === "records")
    ) {
      return pathParts[1]
    }

    return undefined
  } catch (error) {
    return undefined
  }
}

/**
 * Fetch deposit data from Zenodo API
 */
async function loadZenodoDeposit(props: {
  depositId: string
  apiKey?: string
  sandbox?: boolean
}): Promise<ZenodoDeposit> {
  const { depositId, apiKey, sandbox } = props

  const endpoint = `/deposit/depositions/${depositId}`
  const result = await makeZenodoApiRequest({
    endpoint,
    apiKey,
    sandbox,
  })

  return result as ZenodoDeposit
}
