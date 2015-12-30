/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallCenters} from 'collections/call_centers';

@Component({
  selector: 'call_center-details'
})
@View({
  templateUrl: '/client/call_center-details/call_center-details.html',
  directives: [RouterLink, FORM_DIRECTIVES]
})
export class CallCenterDetails {
  callCenter: Object;

  constructor(zone: NgZone, params: RouteParams, private _router: Router) {
    var callCenterId = params.get('callCenterId');
    Tracker.autorun(() => zone.run(() => {
      this.callCenter = CallCenters.findOne(callCenterId);
    }));
  }

  saveCallCenter(callCenter) {
    CallCenters.update(callCenter._id, {
      $set: {
        name: callCenter.name,
        startDate: callCenter.startDate,
        endDate: callCenter.endDate,
        callers: []
      }
    });
    this._router.navigate(['CallCentersList']);
  }
}
