import type * as types from "#types/index.ts"

export const PageIdDefault = "home"

export const Pages = {
  home: {
    pageId: "home",
    file: "home/route.tsx",
    path: undefined,
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
  packageValidate: {
    pageId: "packageValidate",
    file: "package/validate/route.tsx",
    path: {
      de: "/paket-validieren",
      en: "/validate-package",
      es: "/validar-paquete",
      fr: "/valider-paquet",
      it: "/convalidare-pacchetto",
      pt: "/validar-pacote",
      ru: "/проверить-пакет",
      uk: "/перевірити-пакет",
    },
    title: {
      de: "Paket validieren",
      en: "Validate Package",
      es: "Validar Paquete",
      fr: "Valider le paquet",
      it: "Convalidare il pacchetto",
      pt: "Validar Pacote",
      ru: "Проверить пакет",
      uk: "Перевірити пакет",
    },
    description: {
      de: "Validieren Sie Pakete schnell und einfach. Kostenlos online-Werkzeug für die Überprüfung von Daten.",
      en: "Validate packages quickly and easily. Free online tool for validating data.",
      es: "Validar paquetes rápidamente y fácilmente. Herramienta en línea gratuita para la validación de datos.",
      fr: "Validez des paquets rapidement et facilement. Outil en ligne gratuit pour la validation de données.",
      it: "Convalida pacchetti rapidamente e facilmente. Strumento online gratuito per la convalida dei dati.",
      pt: "Validar pacotes rapidamente e facilmente. Ferramenta online gratuita para validação de dados.",
      ru: "Проверьте пакеты быстро и легко. Бесплатный онлайн-инструмент для проверки данных.",
      uk: "Перевірте пакети швидко та легко. Безкоштовний онлайн-інструмент для перев ірачення даних.",
    },
  },
  tableConvert: {
    pageId: "tableConvert",
    file: "table/convert/route.tsx",
    path: {
      de: "/konvertieren-tabelle",
      en: "/convert-table",
      es: "/convertir-tabla",
      fr: "/convertir-table",
      it: "/convertire-tabella",
      pt: "/converter-tabela",
      ru: "/конвертировать-таблицу",
      uk: "/конвертувати-таблицю",
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
  path?: Record<types.LanguageId, string>
  title: Record<types.LanguageId, string>
  description: Record<types.LanguageId, string>
}
