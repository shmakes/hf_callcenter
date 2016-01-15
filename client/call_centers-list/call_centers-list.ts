/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />
/// <reference path="../../typings/moment.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
    selector: 'call_centers-list'
})

@View({
    templateUrl: '/client/call_centers-list/call_centers-list.html',
    directives: [NgFor, CallCentersForm, RouterLink, AccountsUI]
})

@InjectUser()
export class CallCentersList extends MeteorComponent {
  callCenters: Mongo.Cursor<CallCenter>;
  profiles: Mongo.Cursor<UserProfile>;
  profile: UserProfile;
  user: Meteor.User;
  isAdmin: boolean;

  constructor () {
    super();
    this.subscribe('callCenters', () => {
      this.callCenters = CallCenters.find();
    }, true);

    this.subscribe('userProfiles', () => {
      this.profiles = UserProfiles.find();
    }, true);
  }

  canAddAndRemove() {
    if (!this.profile) {
      if (this.profiles && this.user) {
        this.profile = UserProfiles.findOne( { userId: this.user._id } );
        this.isAdmin = (!!this.profile && this.profile.isAdmin);
      } else {
        this.isAdmin = false;
      }
    }
    return this.isAdmin;
  }
  
  formatDate(date: string) {
    var day = moment(date);
    var result = day.calendar();
    return result;
  }

}
