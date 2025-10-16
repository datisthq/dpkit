import { Container } from "@mantine/core"

export function Content(props: { children: React.ReactNode }) {
  return <Container size="lg">{props.children}</Container>
}
