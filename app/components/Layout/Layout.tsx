import { Box } from "@mantine/core"
import type * as types from "#types/index.ts"
import { Content } from "./Content.tsx"
import { Footer } from "./Footer.tsx"
import { Header } from "./Header.tsx"
import { Meta } from "./Meta.tsx"

export function Layout(props: {
  children?: React.ReactNode
  languageId: types.LanguageId
  pageId: types.PageId
}) {
  return (
    <Box>
      <Meta languageId={props.languageId} pageId={props.pageId} />
      <Header />
      <Content children={props.children} />
      <Footer />
    </Box>
  )
}
