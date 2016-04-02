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
    result = DataUtils.mergeValue('first', 'name', nameIn.first, nameRef.first, name.first, result, true);
    result = DataUtils.mergeValue('middle', 'name', nameIn.middle, nameRef.middle, name.middle, result, false);
    result = DataUtils.mergeValue('last', 'name', nameIn.last, nameRef.last, name.last, result, true);
    result = DataUtils.mergeValue('nickname', 'name', nameIn.nickname, nameRef.nickname, name.nickname, result, false);

    return result;
  }

  static mergeValue(name:   string,
                    parent: string,
                    valIn:  any,
                    valRef: any,
                    val:    any,
                    result: MergeResult,
                    force:  boolean) : MergeResult {

    if (valIn != valRef) {
      if(valRef != val) {
        let operation = (force 
          ? `For ${parent}, overrode existing value of ${name}: "${val}" which was originally "${valRef}" with "${valIn}"`
          : `For ${parent}, preserved existing value of ${name}: "${val}" which was originally "${valRef}" but was changed to "${valIn}"`);

        result.conflicts.push( <MergeProperty> {
          propertyName:  name,
          parentName:    parent,
          desiredValue:  valIn,
          originalValue: valRef,
          currentValue:  val,
          resultValue:   (force ? valIn : val),
          formatString:  operation
        });
        if (force) {
          val = valIn;
        }
        valRef = valIn;
      } else {
        result.updates.push( <MergeProperty> {
          propertyName:  name,
          parentName:    parent,
          desiredValue:  valIn,
          originalValue: valRef,
          currentValue:  val,
          resultValue:   valIn,
          formatString:  `For ${parent}, updated existing value of ${name}: "${val}" with "${valIn}"`
        });
        val = valIn;
        valRef = valIn;
      }
    }

    return result;
  }

}

