import type { Pages } from "#constants/page.ts"

export type PageId = keyof typeof Pages
export type Page = (typeof Pages)[PageId]
