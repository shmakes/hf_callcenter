declare type CallCenterHistory = {
  field: string,
  change: string,
  updatedBy: string,
  updatedAt: string
}


declare type CallCenter = {
  _id?: string,
  name: string,
  startDate: string,
  endDate: string,
  flightName: string,
  flightId: string,
  callers: string[],
  history: Array<CallCenterHistory>,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  isRemoved: boolean  
}
