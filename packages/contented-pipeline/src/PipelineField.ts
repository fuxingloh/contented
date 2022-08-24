export type PipelineField =
  | AbstractField<'string', string>
  | AbstractField<'number', number>
  | AbstractField<'string[]', string[]>
  | AbstractField<'number[]', number[]>;

export interface AbstractField<NamedType, T> {
  type: NamedType;
  required?: boolean;
  resolve?: (d: T | undefined, context: any) => T | Promise<T>;
}
