/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {bootstrap} from 'angular2/platform/browser';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';

@Component({
    selector: 'app'
})

@View({
    templateUrl: 'client/app.html',
    directives: [NgFor, CallCentersForm]
})

class HFCallCenter {
  callCenters: Array<Object>;

  constructor (zone: NgZone) {
    Tracker.autorun(() => zone.run(() => {
      this.callCenters = CallCenters.find().fetch();
    }));
  }
}

bootstrap(HFCallCenter);
