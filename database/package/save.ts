// @ts-nocheck
import type { Package, Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"

export async function saveDatabasePackage(
  dataPackage: Package,
  options: {
    loadTable?: (resource: Partial<Resource>) => Promise<Table>
  },
) {}
