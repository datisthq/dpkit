import { Box, Container, Group } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { usePayload } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import classes from "./Footer.module.css"

export function Sitemap() {
  const makeLink = useMakeLink()
  const { languageId } = usePayload()

  return (
    <Box className={classes.links}>
      <Container size="lg">
        <Group px="sm" py="xl" justify="center">
          {Object.values(Pages)
            .filter(page => !!page.Icon)
            .map(page => (
              <Link to={makeLink({ pageId: page.pageId })} key={page.pageId}>
                {page.title[languageId]}
              </Link>
            ))}
        </Group>
      </Container>
    </Box>
  )
}
