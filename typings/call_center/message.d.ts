declare type Message = {
  _id?:           string,
  callCenterId:   string,
  callerId:       string,
  content:        string,
  acknowlegedBy:  Array<string>,
  packetId:       string,
  vetCallSheetId: string,
  grdCallSheetId: string,
  veteranId:      string,
  veteranName:    string,
  guardianId:     string,
  guardianName:   string,
  createdAt:      string,
  createdBy:      string,
  createdName:    string,
  isRemoved:      boolean
}
