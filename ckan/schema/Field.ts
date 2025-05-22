/**
 * CKAN Field interface
 */
export interface CkanField {
  /**
   * Field identifier
   */
  id: string

  /**
   * Field data type
   */
  type: string

  /**
   * Additional field information
   */
  info?: CkanFieldInfo
}

/**
 * CKAN Field Info interface
 */
export interface CkanFieldInfo {
  /**
   * Human-readable field label
   */
  label: string

  /**
   * Additional notes about the field
   */
  notes: string

  /**
   * Field type override
   */
  type_override: string
}
