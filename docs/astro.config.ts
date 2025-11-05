import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightChangelogs, {
  makeChangelogsSidebarLinks,
} from "starlight-changelogs"
import starlightGitHubAlerts from "starlight-github-alerts"
import starlightScrollToTop from "starlight-scroll-to-top"
import starlightTypeDoc from "starlight-typedoc"

const PACKAGES = {
  dpkit: "../dpkit",
  "@dpkit/library": "../lib",
  "@dpkit/arrow": "../arrow",
  "@dpkit/ckan": "../ckan",
  "@dpkit/metadata": "../core",
  "@dpkit/csv": "../csv",
  "@dpkit/database": "../database",
  "@dpkit/datahub": "../datahub",
  "@dpkit/document": "../document",
  "@dpkit/dataset": "../file",
  "@dpkit/github": "../github",
  "@dpkit/html": "../html",
  "@dpkit/inline": "../inline",
  "@dpkit/json": "../json",
  "@dpkit/markdown": "../markdown",
  "@dpkit/ods": "../ods",
  "@dpkit/parquet": "../parquet",
  "@dpkit/table": "../table",
  "@dpkit/xlsx": "../xlsx",
  "@dpkit/zenodo": "../zenodo",
  "@dpkit/zip": "../zip",
}

export default defineConfig({
  site: "https://typescript.dpkit.app",
  srcDir: ".",
  outDir: "build",
  integrations: [
    starlight({
      title: "dpkit",
      description:
        "dpkit is a fast data management framework built on top of the Data Package standard and Polars DataFrames. It supports various formats like CSV, JSON, and Parquet and integrates with data platforms such as CKAN, Zenodo, and GitHub",
      customCss: ["/styles/custom.css"],
      components: {
        SocialIcons: "./components/SocialIcons.astro",
      },
      logo: {
        src: "/assets/dpkit-logo.svg",
        alt: "dpkit Logo",
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
      expressiveCode: {
        themes: ["starlight-dark", "starlight-light"],
      },
      plugins: [
        starlightGitHubAlerts(),
        starlightScrollToTop(),
        starlightChangelogs(),
        starlightTypeDoc({
          entryPoints: generatePackageEntrypoints(),
          tsconfig: "../tsconfig.json",
          typeDoc: { entryPointStrategy: "packages", router: "structure" },
          output: "reference",
          sidebar: {
            label: "API Reference",
            collapsed: true,
          },
        }),
      ],
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "Getting Started", slug: "index" },
            { label: "Contributing", slug: "overview/contributing" },
            { label: "Funding", slug: "overview/funding" },
          ],
        },
        { label: "Guides", autogenerate: { directory: "guides" } },
        {
          label: "API Reference",
          collapsed: true,
          items: generatePackageSidebars(),
        },
        {
          label: "Changelog",
          collapsed: true,
          items: makeChangelogsSidebarLinks([
            {
              type: "recent",
              base: "changelog",
              count: 10,
            },
          ]),
        },
      ],
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://plausible.io/js/script.js",
            "data-domain": "dpkit.app",
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
  return Object.entries(PACKAGES).map(([name, _path]) =>
    generatePackageSidebar({ name }),
  )
}

function generatePackageSidebar(props: { name: string }) {
  const name = props.name
  const slug = name.replace("@", "_")

  return {
    label: name,
    collapsed: true,
    autogenerate: { directory: `reference/${slug}` },
  }
}
