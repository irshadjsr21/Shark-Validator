import RuleSet from '../RuleSet';
import toObject from './toObject';

export default function isArrayOfObject(schema, label, schemaOptions) {
  let objectOptions = {};
  if (schemaOptions) {
    objectOptions = { ...schemaOptions };
  }
  const objectSchema = toObject(schema);
  objectOptions.rules = RuleSet.object(objectSchema);
  objectOptions.label = label;
  objectOptions.type = 'isArrayOfObject';
  return objectOptions;
}
