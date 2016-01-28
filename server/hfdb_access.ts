/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />
/// <reference path="../typings/user_info.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />

declare var process: any;

import 'collections/methods';
import {UserProfiles} from 'collections/user_profiles';
import {CallPackets} from 'collections/call_packets';

Meteor.methods({
  importCallSheetsFromFlight: function(flightName: string) {
    var currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    var currentUserIsCenterAdmin = (!!currentUserProfile && currentUserProfile.isCenterAdmin);

    if (!currentUserIsCenterAdmin) {
      throw new Meteor.Error('401', 'Only call center administrators can add new veteran packets.');
    }

    let options = { auth: process.env.COUCH_AUTH };
    let url = process.env.COUCH_URL + '/' + process.env.COUCH_DB 
        + '/_design/basic/_view/flight_assignment?descending=false&startkey=["'
        + flightName + '"]&endkey=["' + flightName + '",{}]';
    console.log(url);
    let response = HTTP.get(url, options);

    let flightList = JSON.parse(response.content);
    let people = flightList.rows;
    let qtyAdded = 0;
    for (var i in people) {
      let person = people[i];
      console.log(person.key[0] + ' - ' + person.value.type + ' - ' + person.value.name_last);
      qtyAdded++;
    }
    console.log('*** Added ' + qtyAdded + ' new call sheets to flight: ' + flightName);
  }
});

