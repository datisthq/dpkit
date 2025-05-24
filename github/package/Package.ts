import type { GithubResource } from "../resource/index.js"
import type { GithubLicense } from "./License.js"
import type { GithubOwner } from "./Owner.js"

/**
 * Github repository as a package
 */
export interface GithubPackage {
  /**
   * Repository identifier
   */
  id: number

  /**
   * Repository name
   */
  name: string

  /**
   * Repository full name (owner/name)
   */
  full_name: string

  /**
   * Repository owner
   */
  owner: GithubOwner

  /**
   * Repository description
   */
  description: string | null

  /**
   * Repository creation date
   */
  created_at: string

  /**
   * Repository update date
   */
  updated_at: string

  /**
   * Repository homepage URL
   */
  homepage: string | null

  /**
   * Repository size in KB
   */
  size: number

  /**
   * Repository stars count
   */
  stargazers_count: number

  /**
   * Repository watchers count
   */
  watchers_count: number

  /**
   * Repository language
   */
  language: string | null

  /**
   * Repository license
   */
  license: GithubLicense | null

  /**
   * Repository default branch
   */
  default_branch: string

  /**
   * Repository topics
   */
  topics: string[]

  /**
   * Repository is private
   */
  private: boolean

  /**
   * Repository is archived
   */
  archived: boolean

  /**
   * Repository URLs
   */
  html_url: string
  git_url: string
  ssh_url: string
  clone_url: string

  /**
   * Repository resources
   */
  resources?: GithubResource[]
}
