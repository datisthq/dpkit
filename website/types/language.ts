import type { Languages } from "#constants/language.ts"

export type LanguageId = keyof typeof Languages
export type Language = (typeof Languages)[LanguageId]
