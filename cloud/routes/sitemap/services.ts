import { js2xml } from "xml-js"
import { Languages } from "#constants/language.ts"
import { makeLink } from "#helpers/link.ts"
import type * as types from "#types/index.ts"

class BaseSitemap {
  locations: string[] = []

  addLink(location: string) {
    this.locations.push(location)
  }

  toXml(options: { contents: Record<string, any> }) {
    const sitemap = {
      _declaration: { _attributes: { version: "1.0", encoding: "UTF-8" } },
      ...options.contents,
    }

    return js2xml(sitemap, { compact: true, spaces: 2 })
  }
}

export class IndexSitemap extends BaseSitemap {
  toXml() {
    const contents = {
      sitemapindex: {
        _attributes: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" },
        sitemap: this.locations.map(location => ({ loc: { _text: location } })),
      },
    }

    return super.toXml({ contents })
  }
}

export class PartitionSitemap extends BaseSitemap {
  languageId: types.LanguageId

  constructor(options: {
    languageId: types.LanguageId
  }) {
    super()
    this.languageId = options.languageId
  }

  toXml() {
    const contents = {
      urlset: {
        _attributes: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
          "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
          "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
          "xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
          "xmlns:video": "http://www.google.com/schemas/sitemap-video/1.1",
        },
        url: this.locations.map(location => ({ loc: { _text: location } })),
      },
    }

    return super.toXml({ contents })
  }

  addPage(options: {
    pageId: types.PageId
    params?: Record<string, string>
  }) {
    const language = Languages[this.languageId]

    const link = makeLink({
      languageId: language.languageId,
      pageId: options.pageId,
      absolute: true,
    })

    this.addLink(link)
  }
}
