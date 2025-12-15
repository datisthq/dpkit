import { readFile, writeFile } from "node:fs/promises"
import { openai } from "@ai-sdk/openai"
import { tasks } from "@clack/prompts"
import { generateObject } from "ai"
import dotenv from "dotenv"
import { execa } from "execa"
import { po } from "gettext-parser"
import { objectKeys } from "ts-extras"
import { z } from "zod"
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
// Handled by Vite
// await $`lingui compile`

async function translateLanguages() {
  await tasks(
    objectKeys(Languages).map(languageId => ({
      title: `Translating ${languageId}`,
      task: () => translateLanguage(languageId),
    })),
  )
}

// TODO: extract empty messages and translate using JSON/JSONSchema
async function translateLanguage(languageId: types.LanguageId) {
  if (languageId === LanguageIdDefault) return

  const path = `locales/${languageId}/messages.po`
  const source = await readFile(path)

  const pofile = po.parse(source)
  const translations = pofile.translations[""]

  if (!translations) {
    return
  }

  const missingTranslations = Object.values(translations).filter(
    message => message.msgstr && !message.msgstr.filter(Boolean).length,
  )

  if (!missingTranslations.length) {
    return
  }

  const result = await generateObject({
    model: openai("gpt-4.1"),
    schema: z.object({
      translations: z.array(
        z.object({
          msgid: z.string(),
          msgid_plural: z.string().optional(),
          msgstr: z.array(z.string()),
        }),
      ),
    }),
    prompt: `
      You are a professional translator. Here is untranslated PO (gettext) translations.
      Translate them from **${LanguageIdDefault}** to **${languageId}**.

      - Keep all msgid values unchanged
      - Preserve all placeholders like {variable}, %s, {{name}}, etc.
      - Maintain the exact JSON format

      PO (gettext) translations:
      ${JSON.stringify(missingTranslations, null, 2)}
    `,
  })

  // Update added translations
  for (const translatedMessage of result.object.translations) {
    const missingMessage = translations[translatedMessage.msgid]
    if (missingMessage) {
      missingMessage.msgstr = translatedMessage.msgstr
    }
  }

  // Delete removed translations
  pofile.obsolete = {}

  const target = po.compile(pofile, { foldLength: Number.POSITIVE_INFINITY })
  await writeFile(path, target)
}
