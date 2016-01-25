/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />
/// <reference path="../../typings/call_packet.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';
import {UserProfiles} from 'collections/user_profiles';
import {RouterLink, RouteParams} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';
import {CallStatus} from 'collections/enums';
import {Utils} from 'client/utils';

@Component({
    selector: 'call_packets-list'
})

@View({
    templateUrl: '/client/call_packets-list/call_packets-list.html',
    directives: [NgFor, RouterLink, AccountsUI]
})

@InjectUser()
export class CallPacketsList extends MeteorComponent {
  assignedCallPackets: Mongo.Cursor<CallPacket>;
  availableCallPackets: Mongo.Cursor<CallPacket>;
  user: Meteor.User;
  callCenter: CallCenter;
  utils: Utils;
  currentUserProfile: UserProfile;
  isCenterAdmin: boolean;
  

  constructor (params: RouteParams) {
    super();
    this.utils = new Utils();
    var callCenterId = params.get('callCenterId');

    this.subscribe('callCenters', callCenterId, () => {
        this.callCenter = CallCenters.findOne(callCenterId);
    }, true);

    this.subscribe('assignedCallPackets', callCenterId, () => {
      this.assignedCallPackets = CallPackets.find( { callerId: {'$ne' : ''}} );
    }, true);

    this.subscribe('availableCallPackets', callCenterId, () => {
      this.availableCallPackets = CallPackets.find( { callerId: '' } );
    }, true);

    this.subscribe('userProfiles', () => {
      this.currentUserProfile = UserProfiles.findOne( { userId: Meteor.userId() } );
    }, true);
    
  }

  callStatusName(callStat: number) {
    return CallStatus[callStat];
  }

  getCallCenterName() {
    if (this.callCenter && this.callCenter.name) {
      return this.callCenter.name;
    }
  }

  addVeteransFromFlight() {
    var fltName = this.callCenter.flightName;

    if (this.currentUserProfile.isCenterAdmin) {
      Meteor.call('getVeteranListForFlight', fltName, (error) => {
        if (error) {
          alert(`Packets could not be added from flights. ${error}`);
          return;
        }
      });
    } else {
      alert('Please log in as a call center administrator to add new packets from a flight.');
    }
  }
}
