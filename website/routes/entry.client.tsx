import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { activateLocal, detectClientLanguage } from "#helpers/locale.ts"

const language = await detectClientLanguage()
await activateLocal(language.languageId)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
