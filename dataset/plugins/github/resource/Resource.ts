/**
 * GitHub repository file content
 */
export interface GithubResource {
  /**
   * File path within repository
   */
  path: string

  /**
   * File mode e.g. `100755`
   */
  mode: string

  /**
   * File type e.g. `blob`
   */
  type: string

  /**
   * File size in bytes
   */
  size: number

  /**
   * File SHA-1
   */
  sha: string

  /**
   * File url on GitHub API
   */
  url: string
}
