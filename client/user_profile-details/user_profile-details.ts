/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

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
  profile: UserProfile;
  user: Meteor.User;
  isAdmin: boolean;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var userProfileId = params.get('userProfileId');
    this.subscribe('userProfiles', userProfileId, () => {
        this.userProfile = UserProfiles.findOne(userProfileId);
    }, true);
  }

  saveUserProfile(userProfile) {
    if (Meteor.userId()) {
      Meteor.call('updateProfile', userProfile, (error) => {
        if (error) {
          alert(`User profile could not be updated. ${error}`);
          return;
        }
      });
    } else {
      alert('Please log in to make changes.');
    }
    this._router.navigate(['CallCentersList']);
  }

  canAdministrate() {
    if (!this.profile) {
      this.profile = UserProfiles.findOne( { userId: Meteor.userId() } );
      this.isAdmin = (!!this.profile && this.profile.isAdmin);
    }
    return this.isAdmin;
  }

}