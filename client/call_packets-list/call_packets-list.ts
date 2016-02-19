import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';
import {Messages} from 'collections/messages';
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
  messages: Mongo.Cursor<Message>;
  user: Meteor.User;
  callCenterId: string;
  callCenter: CallCenter;
  utils: Utils;
  currentUserProfile: UserProfile;
  isCenterAdmin: boolean;
  packetsVisible: boolean;
  commentsVisible: boolean;
  yourPackets: boolean;
  otherPackets: boolean;
  unassignedPackets: boolean;
  sortSpec: any;
  sortVetNameLast: boolean;
  sortGrdNameLast: boolean;
  messageListHandle: any;
  callerFilterId: string;
  callerFilter: Object;
  callers: Array<UserProfile>;
  users: Array<UserProfile>;

  constructor (params: RouteParams) {
    super();
    this.showPackets();
    this.utils = new Utils();
    this.callCenterId = params.get('callCenterId');

    this.subscribe('callCenters', this.callCenterId, () => {
        this.callCenter = CallCenters.findOne(this.callCenterId);
    }, true);

    this.showYours();
    this.sortVetLastName();

    this.subscribe('userProfiles', () => {

      this.users = UserProfiles.find( { $and: [ { isRemoved: false }, { isValidated: true } ] } ).fetch();      
      this.currentUserProfile = UserProfiles.findOne( { userId: this.user._id } );
    }, true);

    this.callerFilterId = '';
    this.callerFilter = { callerId: { '$ne' : this.user._id } };

    this.messageListsSubscribe();
  }

  callPacketListsSubscribe() {
    this.subscribe('callPackets', this.callCenterId, () => {
      if (this.yourPackets) {
        this.myCallPackets = CallPackets.find( {
          callerId: this.user._id }, this.sortSpec );
      }
      if (this.otherPackets) {
        this.otherCallPackets = CallPackets.find( {
          $and: [ { callerId: { '$ne' : '' } },
                  this.callerFilter ]
        }, this.sortSpec );
      }
      if (this.unassignedPackets) {
        this.unassignedCallPackets = CallPackets.find( {
          callerId: '' }, this.sortSpec );
      }
    }, true);
  }

  messageListsSubscribe() {
    this.messageListHandle = this.subscribe('messages', this.callCenterId, () => {
        this.messages = Messages.find();
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

  showYours() {
    this.yourPackets       = true;
    this.otherPackets      = false;
    this.unassignedPackets = false;
    this.callPacketListsSubscribe();
  }

  showOthers() {
    this.yourPackets       = false;
    this.otherPackets      = true;
    this.unassignedPackets = false;
    this.callPacketListsSubscribe();
  }

  showUnassigned() {
    this.yourPackets       = false;
    this.otherPackets      = false;
    this.unassignedPackets = true;
    this.callPacketListsSubscribe();
  }

  sortVetLastName() {
    this.sortVetNameLast = true;
    this.sortGrdNameLast = false;
    this.sortSpec = { sort: {
      veteranLastName: 1,
      veteranFirstName: 1,
      guardianLastName: 1,
      guardianFirstName: 1 }
    };
    this.callPacketListsSubscribe();
  }

  sortGrdLastName() {
    this.sortVetNameLast = false;
    this.sortGrdNameLast = true;
    this.sortSpec = { sort: {
      guardianLastName: 1,
      guardianFirstName: 1,
      veteranLastName: 1,
      veteranFirstName: 1 }
    };
    this.callPacketListsSubscribe();
  }

  addComment() {
    var message = <Message> {
      callCenterId: this.callCenterId,
      content: 'Fake message at the center level.',
      createdName: this.currentUserProfile.name,
      isRemoved: false
    }
    this.messageListHandle.stop();
    Messages.insert(message);
    this.messageListsSubscribe();
  }

  getCallers() {
    if (this.callers) {
      return this.callers;
    } else {
      if (this.callCenter && this.users) {
        let callers = new Array<UserProfile>();
        for (var userId in this.callCenter.callers) {
          let uId = this.callCenter.callers[userId];
          for (var i in this.users) {
            if (this.users[i].userId == uId) {
              callers.push(this.users[i]);
            }
          }
        }
        this.callers = callers;
        return callers;
      }
    }
  }

  changeCallerFilter(e) {
    if (e && e.target) {
      var callerId = e.target.value;
      if (callerId.length > 1) {
        this.callerFilter = { callerId: callerId };
        this.callPacketListsSubscribe();
        return;
      }
    }
    this.callerFilter = { callerId: { '$ne' : this.user._id } }
    this.callPacketListsSubscribe();
  }

}
