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
      'veteranFirstName':     '',
      'veteranLastName':      '',
      'veteranStatus':        CallStatus.New,
      'guardianCallSheetId':  '',
      'guardianDbId':         '',
      'guardianFirstName':    '',
      'guardianLastName':     '',
      'guardianStatus':       CallStatus.New,
      'mailCallStatus':       CallStatus.New,
      'callStatusHistory':    new Array<CallStatusHistory>(),
      'createdAt':            new Date().toISOString(),
      'updatedAt':            new Date().toISOString(),
      'isRemoved':            false
    };
  }

  static mergeVeteranDataIn(veteranDbDocIn: VeteranDbDoc,
                            veteranDbDocRef: VeteranDbDoc,
                            veteranCallSheet: VeteranCallSheet) : MergeResult {
    // Merge

    return <MergeResult> {
      'messages':   ['Test']
    };
  }

  static mergeGuardianDataIn(guardianDbDocIn: GuardianDbDoc,
                            guardianDbDocRef: GuardianDbDoc,
                            guardianCallSheet: GuardianCallSheet) : MergeResult {
    // Merge

    return <MergeResult> {
      'messages':   ['Test']
    };
  }

}

