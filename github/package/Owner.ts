/**
 * GitHub repository owner
 */
export interface GithubOwner {
  /**
   * Owner login name
   */
  login: string

  /**
   * Owner ID
   */
  id: number

  /**
   * Owner avatar URL
   */
  avatar_url: string

  /**
   * Owner URL
   */
  html_url: string

  /**
   * Owner type (User/Organization)
   */
  type: "User" | "Organization"
}
