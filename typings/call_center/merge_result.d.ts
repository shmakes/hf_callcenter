declare type MergeResult = {
  docId:       string,
  callSheetId: string,
  messages:    string[],
  updates:     MergeProperty[],
  conflicts:   MergeProperty[]
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
