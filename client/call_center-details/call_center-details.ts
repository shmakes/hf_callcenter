/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View, NgZone} from 'angular2/core';
import {FORM_DIRECTIVES, NgIf} from 'angular2/common';
import {RouterLink, RouteParams, Router, CanActivate, ComponentInstruction} from 'angular2/router';
import {CallCenters} from 'collections/call_centers';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

function checkPermissions(instruction: ComponentInstruction) {
  //var callCenterId = instruction.params['callCenterId'];
  //var callCenter = CallCenters.findOne(callCenterId);
  //return (callCenter && callCenter.createdBy == Meteor.userId());
  return Meteor.userId() ? true : false;
}

@Component({
  selector: 'call_center-details'
})
@View({
  templateUrl: '/client/call_center-details/call_center-details.html',
  directives: [RouterLink, FORM_DIRECTIVES]
})

@CanActivate(checkPermissions)
export class CallCenterDetails extends MeteorComponent {
  callCenter: CallCenter;
  users: Mongo.Cursor<Object>;

  constructor(zone: NgZone, params: RouteParams, private _router: Router) {
    super();
    var callCenterId = params.get('callCenterId');
    Tracker.autorun(() => zone.run(() => {
      this.callCenter = CallCenters.findOne(callCenterId);
    }));
  }

  saveCallCenter(callCenter) {
    if (Meteor.userId()) {
      CallCenters.update(callCenter._id, {
        $set: {
          name: callCenter.name,
          startDate: callCenter.startDate,
          endDate: callCenter.endDate,
          callers: []
        }
      });
    } else {
      alert('Please log in to make changes.');
    }
    this._router.navigate(['CallCentersList']);
  }
}
