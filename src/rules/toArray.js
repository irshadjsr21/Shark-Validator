import RuleSet from '../RuleSet';

export default function toArray(rules, label, schemaOptions) {
  let objectOptions = {};
  if (schemaOptions) {
    objectOptions = { ...schemaOptions };
  }
  objectOptions.rules = RuleSet.create(rules);
  objectOptions.label = label;
  objectOptions.type = 'toArray';
  return objectOptions;
}
