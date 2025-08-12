export function parseJson(string: string, options: { isLines: boolean }) {
  return options.isLines
    ? string.split("\n").map(line => JSON.parse(line))
    : JSON.parse(string)
}
