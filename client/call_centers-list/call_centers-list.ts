import {Component, View} from 'angular2/core';
import {NgFor, NgClass, FORM_DIRECTIVES} from 'angular2/common';
import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';
import {Utils} from 'client/utils';

@Component({
    selector: 'call_centers-list'
})

@View({
    templateUrl: '/client/call_centers-list/call_centers-list.html',
    directives: [NgFor, NgClass, CallCentersForm, RouterLink, AccountsUI, FORM_DIRECTIVES]
})

@InjectUser()
export class CallCentersList extends MeteorComponent {
  callCenters: Mongo.Cursor<CallCenter>;
  profiles: Mongo.Cursor<UserProfile>;
  profile: UserProfile;
  user: Meteor.User;
  isSystemAdmin: boolean;
  utils: Utils;

  constructor () {
    super();
    this.utils = new Utils();
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
        this.isSystemAdmin = (!!this.profile && this.profile.isSystemAdmin);
      } else {
        this.isSystemAdmin = false;
      }
    }
    return this.isSystemAdmin;
  }
  
}
