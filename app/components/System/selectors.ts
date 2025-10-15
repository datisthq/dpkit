import { useSystemContext } from "./context.ts"

export function usePayload() {
  const { payload } = useSystemContext()

  return {
    ...payload,
    languageId: payload.language.languageId,
    pageId: payload.page.id,
  }
}
