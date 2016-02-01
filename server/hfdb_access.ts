/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />
/// <reference path="../typings/user_info.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />

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


var initCallPacket = function(callCenter: CallCenter) : CallPacket {

return <CallPacket>
        {
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
};

var fillVetPacketData = function(packet: CallPacket, vetData: any) : CallPacket {
  packet.veteranCallSheetId = vetData._id;
  packet.veteranDbId = vetData._id;
  packet.veteranName = vetData.name.first + ' ' + vetData.name.last;
  packet.veteranStatus = CallStatus.New;

  return packet;
};

var fillGrdPacketData = function(packet: CallPacket, grdData: any) : CallPacket {
  packet.guardianCallSheetId = grdData._id;
  packet.guardianDbId = grdData._id;
  packet.guardianName = grdData.name.first + ' ' + grdData.name.last;
  packet.guardianStatus = CallStatus.New;

  return packet;
};

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
    let packet = initCallPacket(callCenter);

    for (var i in people) {
      if (people[i].key[1] == personPairingId) {
        let grdData = people[i].doc;

        // Check for guardian.
        let existingVet = CallPackets.findOne( {guardianDbId: grdData._id} );
        if (!existingVet) {
          console.log('Adding guardian: ' + grdData.name.first + ' ' + grdData.name.last);
          packet = fillGrdPacketData(packet, grdData);
          grdsAdded++;

          CallPackets.insert(packet);
          packet = initCallPacket(callCenter);
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
            packet = initCallPacket(callCenter);
            let vetData = person.doc;
            console.log('Adding veteran: ' + vetData.name.first + ' ' + vetData.name.last);
            packet = fillVetPacketData(packet, vetData);
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

