import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightScrollToTop from "starlight-scroll-to-top"
import starlightTypeDoc from "starlight-typedoc"

const PACKAGES = {
  dpkit: "../dpkit",
  "@dpkit/camtrap": "../camtrap",
  "@dpkit/ckan": "../ckan",
  "@dpkit/core": "../core",
  "@dpkit/file": "../file",
  "@dpkit/github": "../github",
  "@dpkit/zenodo": "../zenodo",
  "@dpkit/zip": "../zip",
}

export default defineConfig({
  site: "https://dpkit.datist.io",
  srcDir: ".",
  outDir: "build",
  integrations: [
    starlight({
      title: "dpkit",
      description:
        "dpkit is a fast TypeScript data management framework built on top of the Data Package standard and Polars DataFrames. It supports various formats like CSV, JSON, and Parquet and integrates with data platforms such as CKAN, Zenodo, and GitHub",
      customCss: ["/assets/styles.css"],
      components: {
        SocialIcons: "./components/Header/SocialIcons.astro",
      },
      logo: {
        light: "/assets/logo-light.png",
        dark: "/assets/logo-dark.png",
        alt: "DPkit Logo",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/datisthq/dpkit",
        },
      ],
      favicon: "favicon.png",
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
          //collapsed: true,
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
