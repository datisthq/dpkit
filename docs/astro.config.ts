import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightScrollToTop from "starlight-scroll-to-top"
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"

const PACKAGES = {
  dpkit: "../dpkit",
  "@dpkit/ckan": "../ckan",
  "@dpkit/core": "../core",
  "@dpkit/github": "../github",
  "@dpkit/file": "../file",
  "@dpkit/zenodo": "../zenodo",
  "@dpkit/zip": "../zip",
}

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
          entryPoints: generatePackageEntrypoints(),
          tsconfig: "../tsconfig.json",
          typeDoc: { entryPointStrategy: "packages", router: "structure" },
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
        {
          label: "Packages",
          collapsed: true,
          items: generatePackageSidebars(),
        },
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

function generatePackageEntrypoints() {
  return Object.values(PACKAGES)
}

function generatePackageSidebars() {
  return Object.entries(PACKAGES).map(([name, path]) =>
    generatePackageSidebar({ name }),
  )
}

function generatePackageSidebar(props: { name: string }) {
  const name = props.name
  const slug = name.replace("@", "_")

  return {
    label: name,
    collapsed: true,
    items: [
      {
        label: "Overview",
        slug: `packages/${slug}/overview`,
      },
      {
        label: "Changelog",
        slug: `packages/${slug}/changelog`,
      },
      {
        label: "API Reference",
        autogenerate: { directory: `packages/${slug}/index` },
        //collapsed: true,
      },
    ],
  }
}
