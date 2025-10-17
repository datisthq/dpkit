import { Anchor, Box, Image, Stack, Text } from "@mantine/core"
import aboutImage from "#assets/about.png"
import { Link } from "#components/Link/index.ts"
import classes from "./About.module.css"

export function About() {
  return (
    <Stack component="article" gap="xs" align="center" maw="40rem" mx="auto" py="md">
      <Text c="dimmed" size="sm">
        Brought to you by
      </Text>
      <Box className={classes.imageWrapper}>
        <Anchor component={Link} to="https://datist.io" target="_blank" rel="noopener noreferrer">
          <Image src={aboutImage} alt="Datist" w={300} radius="md" bg="white" />
        </Anchor>
      </Box>
      <Text c="dimmed" ta="center" maw="50ch">
        We are bringing technological innovation and consultancy services to open data field
      </Text>
    </Stack>
  )
}
