import { Box } from "@mantine/core"
import { Content } from "./Content.tsx"
import { Footer } from "./Footer.tsx"
import { Header } from "./Header.tsx"
import { Meta } from "./Meta.tsx"

export function Layout(props: {
  children?: React.ReactNode
}) {
  return (
    <Box>
      <Meta />
      <Header />
      <Content children={props.children} />
      <Footer />
    </Box>
  )
}
