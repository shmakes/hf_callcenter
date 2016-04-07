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

  static mergeVeteranDataIn(dbDocIn: VeteranDbDoc,
                            dbDocRef: VeteranDbDoc,
                            callSheet: VeteranCallSheet) : MergeResult {
    // Merge
    let result = <MergeResult> {
      'docId': dbDocIn._id,
      'callSheetId': callSheet._id,
      'messages':   ['Vet Test'],
      'updates': new Array<MergeProperty>(),
      'conflicts': new Array<MergeProperty>(),
    };

    result = DataUtils.mergeGeneral(dbDocIn.general, dbDocRef.general, callSheet.data.general, result);
    callSheet.data.general = result.dataOut;
    dbDocRef.general = result.dataRef;

    result.dataOut = callSheet;
    result.dataRef = dbDocRef;
    return result;
  }

  static mergeGuardianDataIn(dbDocIn: GuardianDbDoc,
                             dbDocRef: GuardianDbDoc,
                             callSheet: GuardianCallSheet) : MergeResult {
    // Merge
    let result = <MergeResult> {
      'docId': dbDocIn._id,
      'callSheetId': callSheet._id,
      'messages':   ['Vet Test'],
      'updates': new Array<MergeProperty>(),
      'conflicts': new Array<MergeProperty>(),
    };

    result = DataUtils.mergeGeneral(dbDocIn.general, dbDocRef.general, callSheet.data.general, result);
    callSheet.data.general = result.dataOut;
    dbDocRef.general = result.dataRef;

    result.dataOut = callSheet;
    result.dataRef = dbDocRef;
    return result;
  }




  static mergeGeneral(dataIn: General, dataRef: General, data: General, result: MergeResult) : MergeResult {
    result = DataUtils.mergeName(dataIn.name, dataRef.name, data.name, result);
    data.name = result.dataOut;
    dataRef.name = result.dataRef;

    result = DataUtils.mergeAddress(dataIn.address, dataRef.address, data.address, result);
    data.address = result.dataOut;
    dataRef.address = result.dataRef;


    result.dataOut = data;
    result.dataRef = dataRef;
    return result;
  }

  static mergeName(nameIn: Name, nameRef: Name, name: Name, result: MergeResult) : MergeResult {
    var props = ['first', 'middle', 'last', 'nickname'];

    for (var p in props) {
      var prop = props[p];
      result = DataUtils.mergeValue(prop, 'name', nameIn[prop], nameRef[prop], name[prop], result, true);
      name[prop] = result.dataOut;
      nameRef[prop] = result.dataRef;
    }

    result.dataOut = name;
    result.dataRef = nameRef;
    return result;
  }

  static mergeAddress(addressIn: Address, addressRef: Address, address: Address, result: MergeResult) : MergeResult {
    var props = ['street', 'city', 'county', 'state', 'zip', 'phone_day', 'phone_eve', 'phone_mbl', 'email'];

    for (var p in props) {
      var prop = props[p];
      result = DataUtils.mergeValue(prop, 'address', addressIn[prop], addressRef[prop], address[prop], result, true);
      address[prop] = result.dataOut;
      addressRef[prop] = result.dataRef;
    }

    result.dataOut = address;
    result.dataRef = addressRef;
    return result;
  }

  static mergeValue(name:   string,
                    parent: string,
                    valIn:  any,
                    valRef: any,
                    val:    any,
                    result: MergeResult,
                    force:  boolean) : MergeResult {

    result.dataRef = valRef;
    result.dataOut = val;

    if (valIn != valRef) {
      result.dataRef = valIn;
      if(valRef != val) {
        result.dataOut = (force ? valIn : val);
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
      } else {
        result.dataOut = valIn;
        result.updates.push( <MergeProperty> {
          propertyName:  name,
          parentName:    parent,
          desiredValue:  valIn,
          originalValue: valRef,
          currentValue:  val,
          resultValue:   valIn,
          formatString:  `For ${parent}, updated existing value of ${name}: "${val}" with "${valIn}"`
        });
      }
    }

    return result;
  }

}

