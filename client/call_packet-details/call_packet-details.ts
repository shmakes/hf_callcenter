import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf, NgFor} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallPackets} from 'collections/call_packets';
import {CallCenters} from 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
import {AccountsUI} from 'meteor-accounts-ui';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'call_packet-details'
})
@View({
  templateUrl: '/client/call_packet-details/call_packet-details.html',
  directives: [NgFor, RouterLink, FORM_DIRECTIVES, NgIf, AccountsUI]
})

@RequireUser()
export class CallPacketDetails extends MeteorComponent {
  callPacket: CallPacket;
  callCenter: CallCenter;
  users: Array<UserProfile>;
  user: UserProfile;
  callers: Array<UserProfile>;
  isCenterAdmin: boolean;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var callPacketId = params.get('callPacketId');
    this.subscribe('callPacket', callPacketId, () => {
      this.callPacket = CallPackets.findOne(callPacketId);
      this.subscribe('callCenters', this.callPacket.callCenterId, () => {
          this.callCenter = CallCenters.findOne(this.callPacket.callCenterId);
      }, true);
    }, true);

    this.subscribe('userProfiles', () => {
      this.users = UserProfiles.find( { $and: [ { isRemoved: false }, { isValidated: true } ] } ).fetch();      
      this.user = UserProfiles.findOne( { userId: Meteor.userId() } );
    }, true);
  }

  changeCaller(e) {
    if (this.user.isCenterAdmin) {
      var callerId = e.target.value;
      var caller = this.callers.filter(function (caller) { return caller.userId === callerId; });
      var callerName = (caller && caller.length == 1) ? caller[0].name : "Unknown";
      var callerHist = this.callPacket.callerHistory || new Array<CallerHistory>();
      var callerHistEntry = <CallerHistory> {
        callerId: callerId,
        callerName: callerName,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callerHist.push(callerHistEntry);

      CallPackets.update(this.callPacket._id, {
        $set: {
          callerId: callerId,
          callerName: callerName,
          callerHistory: callerHist
        }
      });
    } else {
      alert('You must be a call center admin to assign packets.');
    }
  }

  changeVeteranStatus(callPacket) {
    if (this.user.isCenterAdmin) {
      var callStatusHist = callPacket.callStatusHistory || new Array<CallStatusHistory>();
      var callStatusHistEntry = <CallStatusHistory> {
        callType: 0,
        callStatus: callPacket.veteranStatus,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callStatusHist.push(callStatusHistEntry);

      CallPackets.update(callPacket._id, {
        $set: {
          callerId: callPacket.callerId,
          callerName: callPacket.callerName,
          veteranStatus: callPacket.veteranStatus,
          guardianStatus: callPacket.guardianStatus,
          callStatusHistory: callStatusHist
        }
      });
    } else {
      alert('You must be a call center admin to assign packets.');
    }
  }

  getCallCenterId() {
    if (this.callCenter) {
      return this.callCenter._id;
    } 
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
}
