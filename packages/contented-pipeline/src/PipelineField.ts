export type PipelineField =
  | AbstractField<'boolean', boolean>
  | AbstractField<'string', string>
  | AbstractField<'number', number>
  | AbstractField<'string[]', string[]>
  | AbstractField<'number[]', number[]>
  | AbstractField<'object', object>;

export interface AbstractField<NamedType, T> {
  type: NamedType;
  required?: boolean;
  resolve?: (d: T | undefined, context: any) => T | Promise<T>;
}
