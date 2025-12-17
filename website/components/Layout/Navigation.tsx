import { Box, Group } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { usePayload } from "#components/System/index.ts"

export function Navigation() {
  const payload = usePayload()
  const makeLink = useMakeLink()

  return (
    <Group fw="bold" wrap="nowrap">
      {payload.page.pageId !== "terminal" ? (
        <Box>Website</Box>
      ) : (
        <Link to={makeLink({ pageId: "home" })}>Website</Link>
      )}
      {payload.page.pageId === "terminal" ? (
        <Box>Terminal</Box>
      ) : (
        <Link to={makeLink({ pageId: "terminal" })}>Terminal</Link>
      )}
    </Group>
  )
}
