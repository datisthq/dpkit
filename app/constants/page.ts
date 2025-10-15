import type * as types from "#types/index.ts"

export const PageIdDefault = "home"

export const Pages = {
  home: {
    pageId: "home",
    file: "home/route.tsx",
    path: "",
    title: {
      de: "Home",
      en: "Home",
      es: "Inicio",
      fr: "Accueil",
      it: "Home",
      pt: "Início",
      ru: "Домашняя страница",
      uk: "Домашня сторінка",
    },
    description: {
      de: "Home",
      en: "Home",
      es: "Inicio",
      fr: "Accueil",
      it: "Home",
      pt: "Início",
      ru: "Домашняя страница",
      uk: "Домашня сторінка",
    },
  },
  tableConvert: {
    pageId: "tableConvert",
    file: "table/convert/route.tsx",
    path: {
      de: "konvertieren-tabelle",
      en: "convert-table",
      es: "convertir-tabla",
      fr: "convertir-table",
      it: "convertire-tabella",
      pt: "converter-tabela",
      ru: "конвертировать-таблицу",
      uk: "конвертувати-таблицю",
    },
    title: {
      de: "Tabelle Konvertieren",
      en: "Convert Table",
      es: "Convertir Tabla",
      fr: "Convertir Table",
      it: "Convertire Tabella",
      pt: "Converter Tabela",
      ru: "Конвертировать Таблицу",
      uk: "Конвертувати Таблицю",
    },
    description: {
      de: "Konvertieren Sie Tabellen schnell und einfach zwischen CSV, Excel, JSON, Parquet und anderen Formaten. Kostenloses Online-Tool für Datenkonvertierung.",
      en: "Convert tables between CSV, Excel, JSON, Parquet and other formats quickly and easily. Free online tool for seamless data transformation.",
      es: "Convierte tablas entre CSV, Excel, JSON, Parquet y otros formatos de forma rápida y sencilla. Herramienta online gratuita para transformación de datos.",
      fr: "Convertissez des tables entre CSV, Excel, JSON, Parquet et autres formats rapidement et facilement. Outil en ligne gratuit pour la transformation de données.",
      it: "Converti tabelle tra CSV, Excel, JSON, Parquet e altri formati in modo rapido e semplice. Strumento online gratuito per la trasformazione dei dati.",
      pt: "Converta tabelas entre CSV, Excel, JSON, Parquet e outros formatos de forma rápida e fácil. Ferramenta online gratuita para transformação de dados.",
      ru: "Конвертируйте таблицы между CSV, Excel, JSON, Parquet и другими форматами быстро и легко. Бесплатный онлайн-инструмент для преобразования данных.",
      uk: "Конвертуйте таблиці між CSV, Excel, JSON, Parquet та іншими форматами швидко та легко. Безкоштовний онлайн-інструмент для перетворення даних.",
    },
  },
} as const satisfies Record<string, AbstractPage>

interface AbstractPage {
  pageId: string
  file: string
  path: string | Record<types.LanguageId, string>
  title: Record<types.LanguageId, string>
  description: Record<types.LanguageId, string>
}
