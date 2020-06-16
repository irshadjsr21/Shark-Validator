export default function toObject(schema, label, schemaOptions) {
  let objectOptions = {};
  if (schemaOptions) {
    objectOptions = { ...schemaOptions };
  }

  objectOptions.schema = schema;
  objectOptions.label = label;
  return objectOptions;
}
