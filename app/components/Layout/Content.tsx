import { Container } from "@mantine/core"

export function Content(props: { children: React.ReactNode }) {
  return (
    <Container size="lg" px={{ xs: 0, md: "md" }}>
      {props.children}
    </Container>
  )
}
