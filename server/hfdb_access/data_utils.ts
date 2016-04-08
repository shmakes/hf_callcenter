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

    result = DataUtils.mergeValue('_rev', 'veteranData', dbDocIn._rev, dbDocRef._rev, callSheet.data._rev, result, true);
    callSheet.data._rev = result.dataOut;
    dbDocRef._rev = result.dataRef;

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

    result = DataUtils.mergeValue('_rev', 'guardianData', dbDocIn._rev, dbDocRef._rev, callSheet.data._rev, result, true);
    callSheet.data._rev = result.dataOut;
    dbDocRef._rev = result.dataRef;

    result = DataUtils.mergeGeneral(dbDocIn.general, dbDocRef.general, callSheet.data.general, result);
    callSheet.data.general = result.dataOut;
    dbDocRef.general = result.dataRef;

    result.dataOut = callSheet;
    result.dataRef = dbDocRef;
    return result;
  }




  // *** Specific sub-objet Methods ***
  static mergeGeneral(dataIn: General, dataRef: General, data: General, result: MergeResult) : MergeResult {
    result = DataUtils.mergeName(dataIn.name, dataRef.name, data.name, result);
    data.name = result.dataOut;
    dataRef.name = result.dataRef;

    result = DataUtils.mergeAddress(dataIn.address, dataRef.address, data.address, result);
    data.address = result.dataOut;
    dataRef.address = result.dataRef;

    result = DataUtils.mergeValue('size', 'shirt', dataIn.shirt.size, dataRef.shirt.size, data.shirt.size, result, true);
    data.shirt.size = result.dataOut;
    dataRef.shirt.size = result.dataRef;

    ['app_date', 'birth_date', 'weight', 'gender'].map(function(prop) {
      result = DataUtils.mergeValue(prop, 'general', dataIn[prop], dataRef[prop], data[prop], result, true);
      data[prop] = result.dataOut;
      dataRef[prop] = result.dataRef;
    });

    // Emergency Contact
    // Call
    // Apparel

    //result = DataUtils.mergeMetadata(dataIn.metadata, dataRef.metadata, data.metadata, result);
    //data.metadata = result.dataOut;
    //dataRef.metadata = result.dataRef;

    result = DataUtils.mergeValueObject('metadata', 
      ['created_at', 'created_by', 'updated_at', 'updated_by'], 
      dataIn.metadata, dataRef.metadata, data.metadata, result);
    data.metadata = result.dataOut;
    dataRef.metadata = result.dataRef;

    result.dataOut = data;
    result.dataRef = dataRef;
    return result;
  }

  static mergeName(nameIn: Name, nameRef: Name, name: Name, result: MergeResult) : MergeResult {
    ['first', 'middle', 'last', 'nickname'].map(function(prop) {
      result = DataUtils.mergeValue(prop, 'name', nameIn[prop], nameRef[prop], name[prop], result, true);
      name[prop] = result.dataOut;
      nameRef[prop] = result.dataRef;
    });

    result.dataOut = name;
    result.dataRef = nameRef;
    return result;
  }

  static mergeAddress(addressIn: Address, addressRef: Address, address: Address, result: MergeResult) : MergeResult {
    ['street', 'city', 'county', 'state', 'zip', 'phone_day', 'phone_eve', 'phone_mbl', 'email'].map(function(prop) {
      result = DataUtils.mergeValue(prop, 'address', addressIn[prop], addressRef[prop], address[prop], result, true);
      address[prop] = result.dataOut;
      addressRef[prop] = result.dataRef;
    });

    result.dataOut = address;
    result.dataRef = addressRef;
    return result;
  }





  // *** General Methods ***
  static mergeValueObject(parentName: string, valueNames: string[], dataIn: any, dataRef: any, dataOut: any, result: MergeResult) : MergeResult {
    valueNames.map(function(prop) {
      result = DataUtils.mergeValue(prop, parentName, dataIn[prop], dataRef[prop], dataOut[prop], result, true);
      dataOut[prop] = result.dataOut;
      dataRef[prop] = result.dataRef;
    });

    result.dataOut = dataOut;
    result.dataRef = dataRef;
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

