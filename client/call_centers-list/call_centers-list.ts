/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'app'
})

@View({
    templateUrl: 'client/call_centers-list/call_centers-list.html',
    directives: [NgFor, CallCentersForm, RouterLink]
})

export class CallCentersList {
  callCenters: Array<Object>;

  constructor (zone: NgZone) {
    Tracker.autorun(() => zone.run(() => {
      this.callCenters = CallCenters.find().fetch();
    }));
  }

  removeCallCenter(callCenter) {
    CallCenters.remove(callCenter._id);
  }
}
