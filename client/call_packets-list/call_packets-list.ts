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
  myCallPackets: Mongo.Cursor<CallPacket>;
  otherCallPackets: Mongo.Cursor<CallPacket>;
  unassignedCallPackets: Mongo.Cursor<CallPacket>;
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

    this.subscribe('callPackets', callCenterId, () => {
      this.myCallPackets = CallPackets.find( { callerId: this.user._id } );
      this.otherCallPackets = CallPackets.find( { 
        $and: [ { callerId: { '$ne' : '' } }, 
               { callerId: { '$ne' : this.user._id } } ] 
      } );
      this.unassignedCallPackets = CallPackets.find( { callerId: '' } );
    }, true);

    this.subscribe('userProfiles', () => {
      this.currentUserProfile = UserProfiles.findOne( { userId: this.user._id } );
    }, true);
    
  }

  callStatusName(callStat: number) {
    return this.utils.callStatusName(callStat);
  }

  callStatusColorClass(callStat: number) {
    return this.utils.callStatusColorClass(callStat);
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
