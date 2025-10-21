import { type LoaderFunctionArgs, redirect } from "react-router"
import { arrayIncludes, objectKeys } from "ts-extras"
import { Languages } from "#constants/language.ts"
import { LanguageIdDefault } from "#constants/language.ts"

export function loader(props: LoaderFunctionArgs) {
  const possibleLanguageId =
    props?.request.headers.get("accept-language")?.split(",")[0]?.slice(0, 2) ||
    ""

  const languageId = arrayIncludes(objectKeys(Languages), possibleLanguageId)
    ? possibleLanguageId
    : LanguageIdDefault

  throw redirect(`/${languageId}`)
}
