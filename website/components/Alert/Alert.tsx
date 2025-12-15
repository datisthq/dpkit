import { Alert as MantineAlert, Text, Title } from "@mantine/core"

export function Alert(props: { title: string; description: string }) {
  return (
    <MantineAlert
      bd="solid 1px yellow.6"
      variant="light"
      color="yellow"
      title={
        <Title order={2} fw="bold">
          {props.title}
        </Title>
      }
    >
      <Text size="lg">{props.description}</Text>
    </MantineAlert>
  )
}
