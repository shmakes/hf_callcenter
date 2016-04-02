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
    let result = <MergeResult> {
      'docId': veteranDbDocIn._id,
      'callSheetId': veteranCallSheet._id,
      'messages':   ['Vet Test'],
      'updates': new Array<MergeProperty>(),
      'conflicts': new Array<MergeProperty>(),
    };

    // Merge the name.
    result = DataUtils.mergeName(veteranDbDocIn.general.name,
                                 veteranDbDocRef.general.name,
                                 veteranCallSheet.data.general.name,
                                 result);

    return result;
  }

  static mergeGuardianDataIn(guardianDbDocIn: GuardianDbDoc,
                            guardianDbDocRef: GuardianDbDoc,
                            guardianCallSheet: GuardianCallSheet) : MergeResult {
    // Merge

    return <MergeResult> {
      'messages':   ['Grd Test'],
      'updates': new Array<MergeProperty>(),
      'conflicts': new Array<MergeProperty>()
    };
  }

  static mergeName(nameIn:  Name,
                   nameRef: Name,
                   name:    Name,
                   result:  MergeResult) : MergeResult {

    if (nameIn.first != nameRef.first) {
      if(nameRef.first != name.first) {
        result.conflicts.push( <MergeProperty> {
          propertyName:  'first',
          parentName:    'Name',
          desiredValue:  nameIn.first,
          originalValue: nameRef.first,
          currentValue:  name.first,
          resultValue:   nameIn.first,
          formatString:  'todo'
        });
        name.first = nameIn.first;
        nameRef.first = nameIn.first;
      } else {
        result.updates.push( <MergeProperty> {
          propertyName:  'first',
          parentName:    'Name',
          desiredValue:  nameIn.first,
          originalValue: nameRef.first,
          currentValue:  name.first,
          resultValue:   nameIn.first,
          formatString:  'todo'
        });
        name.first = nameIn.first;
        nameRef.first = nameIn.first;
      }
    }

    return result;
  }

}

