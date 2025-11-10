import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { activateLocal, detectClientLanguageId } from "#helpers/locale.ts"

const languageId = await detectClientLanguageId()
await activateLocal(languageId)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
