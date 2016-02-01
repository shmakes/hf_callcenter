import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {UserProfiles} from 'collections/user_profiles';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'user_profile-details'
})
@View({
  templateUrl: '/client/user_profile-details/user_profile-details.html',
  directives: [RouterLink, FORM_DIRECTIVES, NgIf]
})

@RequireUser()
export class UserProfileDetails extends MeteorComponent {
  userProfile: UserProfile;
  currentUserProfile: UserProfile;
  user: Meteor.User;
  isSystemAdmin: boolean;
  userInfo: UserInfo;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var userProfileId = params.get('userProfileId');
    Meteor.call('getPublicUserInfoForProfile', userProfileId, (error, response) => {
      this.userInfo = <UserInfo> {
        name: response.name,
        email: response.email,
        createdAt: response.createdAt
      }
    });
    this.subscribe('userProfiles', userProfileId, () => {
        this.userProfile = UserProfiles.findOne(userProfileId);
    }, true);
  }

  saveUserProfile(userProfile) {
    if (this.userCanEdit()) {
      Meteor.call('updateProfile', userProfile, (error) => {
        if (error) {
          alert(`User profile could not be updated. ${error}`);
          return;
        }
      });
    } else {
      alert('Please log in as a system administrator to make changes to profiles other than your own.');
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

  userCanEdit() {
    return this.userIsSystemAdmin() || this.userProfile.userId == Meteor.userId();
  }

  getUserInfo() {
    return this.userInfo;
  }

}
