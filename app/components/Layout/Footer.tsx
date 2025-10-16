import { Group, Stack } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { usePayload } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import { About } from "./About.tsx"
import classes from "./Footer.module.css"

export function Footer() {
  const makeLink = useMakeLink()
  const { languageId } = usePayload()

  return (
    <Stack component="footer">
      <Group px="sm" py="xl" className={classes.links}>
        {Object.values(Pages)
          .filter(page => page.pageId !== "home")
          .map(page => (
            <Link to={makeLink({ pageId: page.pageId })} key={page.pageId}>
              {page.title[languageId]}
            </Link>
          ))}
      </Group>
      <About />
    </Stack>
  )
}
