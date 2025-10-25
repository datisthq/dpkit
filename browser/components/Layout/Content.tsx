import { Container } from "@mantine/core"

export function Content(props: { children: React.ReactNode }) {
  return (
    <Container size="lg" w="100%">
      {props.children}
    </Container>
  )
}
