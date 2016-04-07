declare var process: any;

import 'collections/methods';
import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';
import {VeteranDbDocs} from 'collections/veteran_db_docs';
import {VeteranCallSheets} from 'collections/veteran_call_sheets';
import {GuardianDbDocs} from 'collections/guardian_db_docs';
import {GuardianCallSheets} from 'collections/guardian_call_sheets';
import {CallStatus} from 'collections/enums';
import {HFDataAdapters} from 'server/hfdb_access/hfdb_data_adapters';
import {DataUtils} from 'server/hfdb_access/data_utils';


Meteor.methods({
  importCallSheetsFromFlight: function(callCenterId: string) {
    let currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    let currentUserIsCenterAdmin = (!!currentUserProfile && currentUserProfile.isCenterAdmin);
    if (!currentUserIsCenterAdmin) {
      throw new Meteor.Error('401', 'Only call center administrators can add new veteran packets.');
    }

    let callCenter = CallCenters.findOne( { _id: callCenterId } );
    if (!callCenter) {
      throw new Meteor.Error('404', 'Call center not found.');
    }
    console.log('Adding call packets for flight: ' + callCenter.flightName + ' to call center: ' + callCenter.name);

    let options = { auth: process.env.COUCH_AUTH };
    let url = process.env.COUCH_URL + '/' + process.env.COUCH_DB
        + '/_design/basic/_view/flight_assignment?descending=false&startkey=["'
        + callCenter.flightName + '"]&endkey=["' + callCenter.flightName + '",{}]&include_docs=true';
    console.log(url);
    let response = HTTP.get(url, options);

    let flightList = JSON.parse(response.content);
    let people = flightList.rows;
    let qtyAdded = 0;
    let vetsAdded = 0;
    let grdsAdded = 0;
    let personPairingId = '';
    let packet = DataUtils.initCallPacket(callCenter);

    for (var i in people) {
      if (people[i].key[1] == personPairingId) {
        let grdData = people[i].doc;

        // Check for guardian.
        let existingVet = CallPackets.findOne( {guardianDbId: grdData._id} );
        if (!existingVet) {
          console.log('Adding guardian: ' + grdData.name.first + ' ' + grdData.name.last);
          let grdDbDoc = HFDataAdapters.fillGuardianDbDoc(grdData);
          GuardianDbDocs.insert(grdDbDoc);
          let grdCallSheet = HFDataAdapters.fillGuardianCallSheet(grdDbDoc, grdData);
          let grdCallSheetId = GuardianCallSheets.insert(grdCallSheet);
          grdCallSheet._id = grdCallSheetId;

          packet = HFDataAdapters.fillGrdPacketData(packet, grdCallSheet);
          grdsAdded++;

          CallPackets.insert(packet);
          packet = DataUtils.initCallPacket(callCenter);
          qtyAdded++;
        }
      } else {

        // Complete the packet after the veteran was added,
        // and we had a chance to add the paired guardian.
        if (packet.veteranDbId) {
          CallPackets.insert(packet);
          qtyAdded++;
        }

        let person = people[i];
        personPairingId = person.key[1];
        let personType = person.key[2];
        if (personType == 0) {
          // Check for Veteran
          let existingVet = CallPackets.findOne( {veteranDbId: person.id} );
          if (!existingVet) {
            packet = DataUtils.initCallPacket(callCenter);
            let vetData = person.doc;

            console.log('Adding veteran: ' + vetData.name.first + ' ' + vetData.name.last);
            let vetDbDoc = HFDataAdapters.fillVeteranDbDoc(vetData);
            VeteranDbDocs.insert(vetDbDoc);
            let vetCallSheet = HFDataAdapters.fillVeteranCallSheet(vetDbDoc, vetData);
            let vetCallSheetId = VeteranCallSheets.insert(vetCallSheet);
            vetCallSheet._id = vetCallSheetId;

            packet = HFDataAdapters.fillVetPacketData(packet, vetCallSheet);
            vetsAdded++;

          } //TODO: else find the vet and see if we can add a guardian.
        } else {
          //TODO: handle lone guardians.
        }
      }
    }

    if (packet.veteranDbId) {
      CallPackets.insert(packet);
      qtyAdded++;
    }
    console.log('*** Added ' + qtyAdded + ' new call packets to flight: ' + callCenter.flightName);
    console.log('*** Added ' + vetsAdded + ' veterans and ' + grdsAdded + ' guardiands to flight: ' + callCenter.flightName);
  },
  updateCallSheetsFromFlight: function(callCenterId: string) {
    let currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    let currentUserIsCenterAdmin = (!!currentUserProfile && currentUserProfile.isCenterAdmin);
    if (!currentUserIsCenterAdmin) {
      throw new Meteor.Error('401', 'Only call center administrators can update veteran packets.');
    }

    let callCenter = CallCenters.findOne( { _id: callCenterId } );
    if (!callCenter) {
      throw new Meteor.Error('404', 'Call center not found.');
    }
    console.log('Updating call packets for flight: ' + callCenter.flightName + ' to call center: ' + callCenter.name);

    let packets = CallPackets.find(
      { callCenterId: callCenterId },
      {
        fields: {
          veteranDbId: 1,
          guardianDbId: 1,
          veteranCallSheetId: 1,
          guardianCallSheetId: 1
        }
      }
    ).fetch();
    console.log('Packets to update: ' + packets.length);

    let docIds = new Array<string>();
    for (var p in packets) {
      let packet = packets[p];
      if (packet.veteranDbId) {
        docIds.push(packet.veteranDbId);
      }
      if (packet.guardianDbId) {
        docIds.push(packet.guardianDbId);
      }
    }
    let postData = {
      "doc_ids": docIds
    };
    console.log('Call sheets to update: ' + docIds.length);

    let options = { auth: process.env.COUCH_AUTH, data: postData };
    let url = process.env.COUCH_URL + '/' + process.env.COUCH_DB
        + '/_changes?include_docs=true&filter=_doc_ids';
    console.log(url);
    let response = HTTP.post(url, options);

    let updateList = JSON.parse(response.content);
    console.log('Docs from database: ' + updateList.results.length);

    let vetEval = 0;
    let grdEval = 0;
    let vetUpdate = 0;
    let grdUpdate = 0;
    for (var d in updateList.results) {
      let cDoc = updateList.results[d].doc;
      if (cDoc.type == 'Veteran') {
        let fltDoc = HFDataAdapters.fillVeteranDbDoc(cDoc);
        let dbDoc = VeteranDbDocs.findOne( { _id: fltDoc._id } );
        let callSheet = VeteranCallSheets.findOne( { 'data._id': fltDoc._id } );
        if (dbDoc && callSheet) {
          if (dbDoc._rev != fltDoc._rev) {
            let result = DataUtils.mergeVeteranDataIn(fltDoc, dbDoc, callSheet);
            if (result.updates.length > 0 || result.conflicts.length > 0) {
              VeteranDbDocs.update({_id: dbDoc._id}, result.dataRef);
              VeteranCallSheets.update({_id: callSheet._id}, result.dataOut);

              console.log(result.updates);
              console.log('UPDATED - Veteran: ' + dbDoc.general.name.first + ' ' + dbDoc.general.name.last);
              vetUpdate++;
            }
            vetEval++;
          }
        } else {
            console.log('MISSING - Veteran: ' + dbDoc.general.name.first + ' ' + dbDoc.general.name.last);
        }
      } else if (cDoc.type == 'Guardian') {
        let fltDoc = HFDataAdapters.fillGuardianDbDoc(cDoc);
        let dbDoc = GuardianDbDocs.findOne( { _id: fltDoc._id } );
        let callSheet = GuardianCallSheets.findOne( { 'data._id': fltDoc._id } );
        if (dbDoc && callSheet) {
          if (dbDoc._rev != fltDoc._rev) {
            let result = DataUtils.mergeGuardianDataIn(fltDoc, dbDoc, callSheet);
            if (result.updates.length > 0 || result.conflicts.length > 0) {
              GuardianDbDocs.update({_id: dbDoc._id}, result.dataRef);
              GuardianCallSheets.update({_id: callSheet._id}, result.dataOut);
              console.log(result.updates);
              console.log('UPDATED - Guardian: ' + dbDoc.general.name.first + ' ' + dbDoc.general.name.last);
              grdUpdate++;
            }
            grdEval++;
          }
        } else {
            console.log('MISSING - Guardian: ' + dbDoc.general.name.first + ' ' + dbDoc.general.name.last);
        }
      }
    }

    console.log('Evaluated ' + vetEval + ' veterans and updated ' + vetUpdate);
    console.log('Evaluated ' + grdEval + ' guardians and updated ' + grdUpdate);

  }
});

