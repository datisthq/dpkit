import { readFile, writeFile } from "node:fs/promises"
import { openai } from "@ai-sdk/openai"
import { spinner } from "@clack/prompts"
import { generateText } from "ai"
import dotenv from "dotenv"
import { execa } from "execa"
import { objectKeys } from "ts-extras"
import { LanguageIdDefault, Languages } from "#constants/language.ts"
import type * as types from "#types/index.ts"

process.chdir(import.meta.dirname)
dotenv.config()

const $ = execa({
  stdout: ["inherit", "pipe"],
  verbose: "short",
  preferLocal: true,
})

await $`lingui extract`
await translateLanguages()
await $`lingui compile`

async function translateLanguages() {
  for (const languageId of objectKeys(Languages)) {
    if (languageId === LanguageIdDefault) continue
    const task = spinner()
    task.start(`Translating ${languageId}...`)
    await translateLanguage(languageId)
    task.stop(`Translated ${languageId}`)
  }
}

async function translateLanguage(languageId: types.LanguageId) {
  const path = `locales/${languageId}/messages.po`
  const content = await readFile(path)

  const { text } = await generateText({
    model: openai("gpt-4.1"),
    prompt: `
      You are a professional translator. Here is a PO (gettext) file.

      Translate ONLY the empty msgstr entries (where msgstr "")
      from **${LanguageIdDefault}** to **${languageId}**.

      - Keep all msgid values unchanged
      - Preserve all placeholders like {variable}, %s, {{name}}, etc.
      - Maintain the exact PO file format
      - Do NOT translate entries that already have translations
      - Keep all comments and metadata

      Return the complete PO file with translations filled in.

      PO file:
      ${content}
    `,
  })

  await writeFile(path, text)
}
