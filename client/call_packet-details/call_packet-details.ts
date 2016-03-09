import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf, NgFor, NgClass} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallPackets} from 'collections/call_packets';
import {CallCenters} from 'collections/call_centers';
import {VeteranCallSheets} from 'collections/veteran_call_sheets';
import {GuardianCallSheets} from 'collections/guardian_call_sheets';
import {UserProfiles} from 'collections/user_profiles';
import {AccountsUI} from 'meteor-accounts-ui';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';
import {Utils} from 'client/utils';
import {CallStatus} from 'collections/enums';
import {CallType} from 'collections/enums';

@Component({
  selector: 'call_packet-details'
})
@View({
  templateUrl: '/client/call_packet-details/call_packet-details.html',
  directives: [NgFor, NgClass, RouterLink, FORM_DIRECTIVES, NgIf, AccountsUI]
})

@RequireUser()
export class CallPacketDetails extends MeteorComponent {
  callPacket: CallPacket;
  callCenter: CallCenter;
  veteranCallSheet: VeteranCallSheet;
  guardianCallSheet: GuardianCallSheet;
  utils: Utils;
  users: Array<UserProfile>;
  user: UserProfile;
  callers: Array<UserProfile>;
  isCenterAdmin: boolean;
  callStatuses: { key: number, val: string }[];
  historyVisible: boolean;
  infoVisible: boolean;

  constructor(params: RouteParams, private _router: Router) {
    super();
    this.showHistory();
    this.utils = new Utils();
    this.callStatusList();
    var callPacketId = params.get('callPacketId');
    this.subscribe('callPacket', callPacketId, () => {
      this.callPacket = CallPackets.findOne(callPacketId);
      this.subscribe('callCenters', this.callPacket.callCenterId, () => {
          this.callCenter = CallCenters.findOne(this.callPacket.callCenterId);
      }, true);
      this.subscribe('veteranCallSheet', this.callPacket.veteranCallSheetId, () => {
          this.veteranCallSheet = VeteranCallSheets.findOne(this.callPacket.veteranCallSheetId);
      }, true);
      this.subscribe('guardianCallSheet', this.callPacket.guardianCallSheetId, () => {
          this.guardianCallSheet = GuardianCallSheets.findOne(this.callPacket.guardianCallSheetId);
      }, true);
    }, true);

    this.subscribe('userProfiles', () => {
      this.users = UserProfiles.find( { $and: [ { isRemoved: false }, { isValidated: true } ] } ).fetch();      
      this.user = UserProfiles.findOne( { userId: Meteor.userId() } );
    }, true);
  }

  changeCaller(e) {
    if (this.user.isCenterAdmin && !this.user.isRemoved) {
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
      this.callPacket.updatedAt = new Date().toISOString();

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

  changeVeteranStatus(e) {
    if (this.user.isValidated && !this.user.isRemoved) {
      var callStatusNum = Number(e.target.value);
      var callStatusHist = this.callPacket.callStatusHistory || new Array<CallStatusHistory>();
      var callStatusHistEntry = <CallStatusHistory> {
        callType: CallType.Veteran,
        callStatus: callStatusNum,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callStatusHist.push(callStatusHistEntry);
      this.callPacket.updatedAt = new Date().toISOString();

      CallPackets.update(this.callPacket._id, {
        $set: {
          veteranStatus: callStatusNum,
          callStatusHistory: callStatusHist
        }
      });
    } else {
      alert('You must be a valid user to change veteran status.');
    }
  }

  changeGuardianStatus(e) {
    if (this.user.isValidated && !this.user.isRemoved) {
      var callStatusNum = Number(e.target.value);
      var callStatusHist = this.callPacket.callStatusHistory || new Array<CallStatusHistory>();
      var callStatusHistEntry = <CallStatusHistory> {
        callType: CallType.Guardian,
        callStatus: callStatusNum,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callStatusHist.push(callStatusHistEntry);
      this.callPacket.updatedAt = new Date().toISOString();

      CallPackets.update(this.callPacket._id, {
        $set: {
          guardianStatus: callStatusNum,
          callStatusHistory: callStatusHist
        }
      });
    } else {
      alert('You must be a valid user to change guardian status.');
    }
  }

  changeMailCallStatus(e) {
    if (this.user.isValidated && !this.user.isRemoved) {
      var callStatusNum = Number(e.target.value);
      var callStatusHist = this.callPacket.callStatusHistory || new Array<CallStatusHistory>();
      var callStatusHistEntry = <CallStatusHistory> {
        callType: CallType.MailCall,
        callStatus: callStatusNum,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callStatusHist.push(callStatusHistEntry);
      this.callPacket.updatedAt = new Date().toISOString();

      CallPackets.update(this.callPacket._id, {
        $set: {
          mailCallStatus: callStatusNum,
          callStatusHistory: callStatusHist
        }
      });
    } else {
      alert('You must be a valid user to change mail call status.');
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

  callTypeName(callType: number) :string {
    return this.utils.callTypeName(callType);
  }

  callStatusName(callStat: number) {
    return this.utils.callStatusName(callStat);
  }
  callStatusColorClass(callStat: number) {
    return this.utils.callStatusColorClass(callStat);
  }
  callStatusList() {
    if (this.callStatuses) {
      return this.callStatuses;
    } else {
      this.callStatuses = [];
      for(var n in CallStatus) {
        if(typeof CallStatus[n] === 'number') {
          this.callStatuses.push({ 
            key: Number(CallStatus[n]),
            val: String(n)
          });
        }
      }
    }
  }

  showHistory() {
    this.historyVisible  = true;
    this.infoVisible = false;
  }

  showInfo() {
    this.historyVisible  = false;
    this.infoVisible = true;
  }
}
