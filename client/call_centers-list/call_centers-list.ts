/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {UserRoles} from 'collections/user_roles';
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
  roles: Mongo.Cursor<UserRole>;
  role: UserRole;
  user: Meteor.User;
  isAdmin: boolean;

  constructor () {
    super();
    this.subscribe('callCenters', () => {
      this.callCenters = CallCenters.find();
    }, true);

    this.subscribe('userRoles', () => {
      this.roles = UserRoles.find();
    }, true);
  }

  canAddAndRemove() {
    if (!this.role) {
      if (this.roles && this.user) {
        this.role = UserRoles.findOne( { userId: this.user._id } );
        this.isAdmin = (!!this.role && this.role.isAdmin);
      } else {
        this.isAdmin = false;
      }
    }
    return this.isAdmin;
  }

  removeCallCenter(callCenter) {
    CallCenters.remove(callCenter._id);
  }

  
}
