import { Box, Stack } from "@mantine/core"
import { Banner } from "./Banner.tsx"
import { Content } from "./Content.tsx"
import { Footer } from "./Footer.tsx"
import { Header } from "./Header.tsx"
import { Meta } from "./Meta.tsx"

export function Layout(props: {
  children?: React.ReactNode
}) {
  return (
    <Stack gap={40}>
      <Meta />
      <Box>
        <Header />
        <Banner />
      </Box>
      <Content>{props.children}</Content>
      <Footer />
    </Stack>
  )
}
