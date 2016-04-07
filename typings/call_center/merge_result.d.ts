declare type MergeResult = {
  docId:       string,
  callSheetId: string,
  messages:    string[],
  updates:     MergeProperty[],
  conflicts:   MergeProperty[],
  dataRef:     any,
  dataOut:     any
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
