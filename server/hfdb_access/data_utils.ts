import {CallStatus} from 'collections/enums';

export class DataUtils {

  static initCallPacket(callCenter: CallCenter) : CallPacket {
    return <CallPacket> {
      'callCenterId':         callCenter._id,
      'callCenterName':       callCenter.name,
      'callerId':             '',
      'callerName':           '',
      'callerHistory':        new Array<CallerHistory>(),
      'veteranCallSheetId':   '',
      'veteranDbId':          '',
      'veteranName':          '',
      'veteranStatus':        CallStatus.New,
      'guardianCallSheetId':  '',
      'guardianDbId':         '',
      'guardianName':         '',
      'guardianStatus':       CallStatus.New,
      'mailCallName':         '',
      'mailCallRelationship': '',
      'mailCallPhone':        '',
      'mailCallEmail':        '',
      'mailCallStatus':       CallStatus.New,
      'callStatusHistory':    new Array<CallStatusHistory>(),
      'createdAt':            new Date().toISOString(),
      'updatedAt':            new Date().toISOString(),
      'isRemoved':            false
    };
  }

}

