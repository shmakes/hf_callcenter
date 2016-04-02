declare type MergeResult = {
  messages:  string[],
  updated:   MergeProperty[],
  conflicts: MergeProperty[]
}

declare type MergeProperty = {
  propertyName:  string,
  parentName:    string,
  desiredValue:  string,
  originalValue: string,
  currentValue:  string,
  resultValue:   string,
  formatString:  string
}
