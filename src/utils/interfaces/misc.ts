/**
 * SelectOption is used for populating dropdown fields with options that can be added, updated or removed.
 */

export interface SelectOption {
  /**auto generated unique mongodb ObjectID/guid/cuid/suid/nanoid */
  _id: string
  /** a name that identifies a select field element in a form */
  field_name: string,
  /** _id of a SelectOption for nesting sub select-options */
  parent_id?: string,
  /** the name of the form element. Used esp with radio or checkbox inputs */
  name?: string
  /**a Label for the form element */
  label?: string
  /**value of the selected option to be sent onSubmit */
  value: string
  /** auto-generated meta */
  created_at: string | Date
  /** auto-generated meta */
  updated_at: string | Date
  /** auto-generated meta used for soft-deletes */
  deleted_at: string | Date

}


export interface Contact {
  _id: string
  profile_id: string
}