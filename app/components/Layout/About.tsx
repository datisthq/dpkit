import { Text } from "@mantine/core"
import aboutImage from "#assets/about.png"
import classes from "./About.module.css"

export function About() {
  return (
    <article className={classes.article}>
      <small className={classes.small}>Brought to you by</small>
      <div className={classes.imageWrapper}>
        <a href="https://datist.io">
          <img
            src={aboutImage}
            alt="Datist"
            width={300}
            className={classes.image}
          />
        </a>
      </div>
      <Text color="dimmed">
        We are bringing technological innovation and consultancy
        <br /> services to open data field
      </Text>
    </article>
  )
}
