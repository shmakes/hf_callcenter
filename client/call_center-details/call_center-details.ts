/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf} from 'angular2/common';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {CallCenters} from 'collections/call_centers';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'call_center-details'
})
@View({
  templateUrl: '/client/call_center-details/call_center-details.html',
  directives: [RouterLink, FORM_DIRECTIVES, NgIf]
})

@RequireUser()
export class CallCenterDetails extends MeteorComponent {
  callCenter: CallCenter;

  constructor(params: RouteParams, private _router: Router) {
    super();
    var callCenterId = params.get('callCenterId');
    this.subscribe('callCenters', callCenterId, () => {
        this.callCenter = CallCenters.findOne(callCenterId);
    }, true);
  }

  saveCallCenter(callCenter) {
    if (Meteor.userId()) {
      CallCenters.update(callCenter._id, {
        $set: {
          name: callCenter.name,
          startDate: callCenter.startDate,
          endDate: callCenter.endDate,
          isRemoved: callCenter.isRemoved
        }
      });
    } else {
      alert('Please log in to make changes.');
    }
    this._router.navigate(['CallCentersList']);
  }
}
