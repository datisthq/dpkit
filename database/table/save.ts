import type { SaveTableOptions, Table } from "@dpkit/table"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function savePostgresTable(
  _table: Table,
  _options: SaveTableOptions,
) {}

export async function saveMysqlTable(
  _table: Table,
  _options: SaveTableOptions,
) {}

export async function saveSqliteTable(
  _table: Table,
  _options: SaveTableOptions,
) {}
