/// <reference path="../../typings/angular2-meteor.d.ts" />
 
import {Component, View} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {CallCenters} from 'collections/call_centers';
 
@Component({
  selector: 'call_center-details'
})
@View({
  templateUrl: '/client/call_center-details/call_center-details.html'
})
export class CallCenterDetails {
  callCenter: Object;

  constructor(params: RouteParams) {
    var callCenterId = params.get('callCenterId');
    this.callCenter = CallCenters.findOne(callCenterId);
  }
}
