/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {MeteorComponent} from 'angular2-meteor';

@Component({
    selector: 'call_centers-list'
})

@View({
    templateUrl: '/client/call_centers-list/call_centers-list.html',
    directives: [NgFor, CallCentersForm, RouterLink, AccountsUI]
})

export class CallCentersList extends MeteorComponent {
  callCenters: Mongo.Cursor<CallCenter>;

  constructor () {
    super();
    this.subscribe('callCenters', () => {
      this.callCenters = CallCenters.find();
    }, true);
  }

  removeCallCenter(callCenter) {
    CallCenters.remove(callCenter._id);
  }
}
