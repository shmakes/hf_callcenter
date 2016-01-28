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
  packetsVisible: boolean;
  commentsVisible: boolean;

  constructor (params: RouteParams) {
    super();
    this.showPackets();
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
    return CallStatus[callStat].split(/(?=[A-Z])/).join(' ');
  }

  callStatusColorClass(callStat: number) {
    switch (this.callStatusName(callStat)) {
      case 'New':
        return 'label-default';
      case 'No Answer':
        return 'label-info'
      case 'Left Message':
        return 'label-info';
      case 'Wait To Call Back':
        return 'label-info'
      case 'Phone Disconnected':
        return 'label-warning';
      case 'Wrong Number':
        return 'label-warning'
      case 'Accepted':
        return 'label-success';
      case 'Tentative':
        return 'label-info'
      case 'Declined':
        return 'label-danger';
      case 'Future':
        return 'label-primary'
      case 'Flown Already':
        return 'label-primary';
      case 'Remove':
        return 'label-warning';
      case 'Deceased':
        return 'label-danger';
      default:
        return 'label-default';
    }
  }

  userIsCenterAdmin() {
    if (this.currentUserProfile) {
      return this.currentUserProfile.isCenterAdmin;
    }
  }

  getCallCenterName() {
    if (this.callCenter) {
      return this.callCenter.name;
    }
  }

  getCallCenterIsRemoved() {
    if (this.callCenter) {
      return this.callCenter.isRemoved;
    }
  }

  addVeteransFromFlight() {
    var centerId = this.callCenter._id;

    if (this.userIsCenterAdmin()) {
      Meteor.call('getVeteranListForFlight', centerId, (error) => {
        if (error) {
          alert(`Packets could not be added from flights. ${error}`);
          return;
        }
      });
    } else {
      alert('Please log in as a call center administrator to add new packets from a flight.');
    }
  }

  showPackets() {
    this.packetsVisible  = true;
    this.commentsVisible = false;
  }

  showComments() {
    this.packetsVisible  = false;
    this.commentsVisible = true;
  }
}
