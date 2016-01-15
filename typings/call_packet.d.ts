declare type CallerHistory = {
  caller: string,
  updatedBy: string,
  updatedAt: string
}

declare type CallStatusHistory = {
  callType: number,
  callStatus: number,
  updatedBy: string,
  updatedAt: string
}

declare type CallPacket = {
  _id?: string,
  callCenterId: string,
  callCenterName: string,
  callerId: string,
  callerName: string,
  callerHistory: Array<CallerHistory>,
  veteranId: string,
  veteranName: string,
  veteranStatus: number,
  guardianId: string,
  guardianName: string,
  guardianStatus: number,
  mailCallName: string,
  mailCallRelationship: string,
  mailCallPhone: string,
  mailCallEmail: string,
  mailCallStatus: number,
  callStatusHistory: Array<CallStatusHistory>,
  createdAt: string,
  updatedAt: string,
  isRemoved: boolean
}

