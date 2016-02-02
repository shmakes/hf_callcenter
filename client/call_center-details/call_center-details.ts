import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf, NgFor} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallCenters} from 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'call_center-details'
})
@View({
  templateUrl: '/client/call_center-details/call_center-details.html',
  directives: [NgFor, RouterLink, FORM_DIRECTIVES, NgIf]
})

@RequireUser()
export class CallCenterDetails extends MeteorComponent {
  callCenter: CallCenter;
  users: Array<UserProfile>;
  available: Array<UserProfile>;
  callers: Array<UserProfile>;
  currentUserProfile: UserProfile;
  isSystemAdmin: boolean;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var callCenterId = params.get('callCenterId');
    this.subscribe('callCenters', callCenterId, () => {
        this.callCenter = CallCenters.findOne(callCenterId);
    }, true);

    this.subscribe('userProfiles', () => {
      this.users = UserProfiles.find( { $and: [ { isRemoved: false }, { isValidated: true } ] } ).fetch();
    }, true);
  }

  getCallerInfo() {
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

  getAvailableUsers() {
    if (this.available) {
      return this.available;
    } else {
      if (this.callCenter && this.users) {
        let available = new Array<UserProfile>();
        for (var i in this.users) {
          let userAvailable = true;
          let uId = this.users[i].userId;
          for (var userId in this.callCenter.callers) {
            if (this.callCenter.callers[userId] == uId) {
              userAvailable = false;
              break;
            }
          }
          if (userAvailable) {
            available.push(this.users[i]);
          }
        }
        this.available = available;
        return available;
      }
    }
  }

  addCaller(userId: string) {
    this.callCenter.callers.push(userId);
    delete this.callers;
    delete this.available;
  }

  removeCaller(userId: string) {
    var n = this.callCenter.callers.indexOf(userId);
    this.callCenter.callers.splice(n, 1);
    delete this.callers;
    delete this.available;
  }

  saveCallCenter(callCenter) {
    if (this.userIsSystemAdmin()) {
      CallCenters.update(callCenter._id, {
        $set: {
          name: callCenter.name,
          startDate: callCenter.startDate,
          endDate: callCenter.endDate,
          callers: callCenter.callers,
          isRemoved: callCenter.isRemoved
        }
      });
    } else {
      alert('Please log in as a system administrator to make changes.');
    }
    this._router.navigate(['CallCentersList']);
  }

  userIsSystemAdmin() {
    if (!this.currentUserProfile) {
      this.currentUserProfile = UserProfiles.findOne( { userId: Meteor.userId() } );
      this.isSystemAdmin = (!!this.currentUserProfile && this.currentUserProfile.isSystemAdmin);
    }
    return this.isSystemAdmin;
  }

}
