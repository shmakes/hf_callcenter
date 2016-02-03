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
          packet = HFDataAdapters.fillGrdPacketData(packet, grdData);
          grdsAdded++;

          CallPackets.insert(packet);
          packet = DataUtils.initCallPacket(callCenter);
          qtyAdded++;
        }
      } else {

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
            VeteranCallSheets.insert(vetCallSheet);

            packet = HFDataAdapters.fillVetPacketData(packet, vetData);
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
  }
});

