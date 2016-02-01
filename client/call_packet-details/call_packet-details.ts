import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf, NgFor} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallPackets} from 'collections/call_packets';
import {UserProfiles} from 'collections/user_profiles';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'call_packet-details'
})
@View({
  templateUrl: '/client/call_packet-details/call_packet-details.html',
  directives: [NgFor, RouterLink, FORM_DIRECTIVES, NgIf]
})

@RequireUser()
export class CallPacketDetails extends MeteorComponent {
  callPacket: CallPacket;
  user: UserProfile;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var callPacketId = params.get('callPacketId');
    this.subscribe('callPacket', callPacketId, () => {
        this.callPacket = CallPackets.findOne(callPacketId);
    }, true);

    this.subscribe('userProfiles', () => {
      this.user = UserProfiles.findOne( { userId: Meteor.userId() } );
    }, true);
  }


  saveCallPacket(callPacket) {
    if (Meteor.userId()) {
      var callStatusHist = callPacket.callStatusHistory || new Array<CallerHistory>();
      var callStatusHistEntry = <CallStatusHistory> {
        callType: 0,
        callStatus: callPacket.veteranStatus,
        updatedBy: this.user.name + '(' + this.user.userId + ')',
        updatedAt: new Date().toISOString()
      };
      callStatusHist.push(callStatusHistEntry);

      CallPackets.update(callPacket._id, {
        $set: {
          veteranStatus: callPacket.veteranStatus,
          guardianStatus: callPacket.guardianStatus,
          callStatusHistory: callStatusHist
        }
      });
    } else {
      alert('Please log in to make changes.');
    }
    this._router.navigate(['CallPacketsList', { callCenterId: callPacket.callCenterId }]);
  }
}
