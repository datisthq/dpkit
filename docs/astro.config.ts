import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightScrollToTop from "starlight-scroll-to-top"
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"

export default defineConfig({
  site: "https://dpkit.datist.io",
  srcDir: ".",
  outDir: "build",
  integrations: [
    starlight({
      title: "Data Package in TypeScript",
      description:
        "Data Package is a standard consisting of a set of simple yet extensible specifications to describe datasets, data files and tabular data. It is a data definition language (DDL) and data API that facilitates findability, accessibility, interoperability, and reusability (FAIR) of data.",
      customCss: ["/assets/styles.css"],
      logo: {
        light: "/assets/logo-light.svg",
        dark: "/assets/logo-dark.svg",
        alt: "Data Package Logo",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/datisthq/dpkit",
        },
      ],
      favicon: "favicon.ico",
      editLink: {
        baseUrl: "https://github.com/datisthq/dpkit/edit/main/",
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 5 },
      plugins: [
        starlightScrollToTop(),
        starlightTypeDoc({
          entryPoints: ["../dpkit", "../core", "../file", "../zip"],
          tsconfig: "../tsconfig.json",
          typeDoc: { entryPointStrategy: "packages" },
          output: "packages",
          sidebar: {
            label: "Packages",
            collapsed: true,
          },
        }),
      ],
      sidebar: [
        { label: "Overview", autogenerate: { directory: "overview" } },
        { label: "Guides", autogenerate: { directory: "guides" } },
        typeDocSidebarGroup,
      ],
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://plausible.io/js/script.js",
            "data-domain": "dpkit.datist.io",
            defer: true,
          },
        },
      ],
    }),
  ],
})
