export type ContentedField = ContentedFieldString

export interface ContentedFieldString {
  type: 'string',
  required: boolean,
  resolve?: () => string | Promise<string>,
}
