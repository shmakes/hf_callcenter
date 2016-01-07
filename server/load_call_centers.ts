/// <reference path="../typings/call_center.d.ts" />

import {Organizations} from 'collections/organizations';
import {CallCenters} from 'collections/call_centers';
 
export function loadCallCenters() {
    if (CallCenters.find().count() === 0) {

    var organizations = [
        {
          'orgName': 'SSHF',
          'dbUrl': 'http://dvr01:5984/hf',
          'dDoc': 'basic',
          'dbUser': '<user>',
          'dbPass': '<pass>'
        }
    ];
    for (var i = 0; i < organizations.length; i++) {
        Organizations.insert(organizations[i]);
    }
 
    var callCenters = [
        {
            'name': 'April 2016',
            'startDate': new Date().toISOString(),
            'endDate': new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
            'flightName': 'SSHF-Apr2016',
            'flightId': '6ee5e5c42cd34bc23225d2136601a14f',
            'createdBy': 'Sample'
        },
        {
            'name': 'May 2016',
            'startDate': '2016-05-14T18:00:00.000Z',
            'endDate': '2016-05-28T18:00:00.000Z',
            'flightName': 'SSHF-May2016',
            'flightId': '6ee5e5c42cd34bc23225d2136601a9ed',
            'createdBy': 'Sample'
        }
    ];
    for (var i = 0; i < callCenters.length; i++) {
        CallCenters.insert(callCenters[i]);
    }
  }
};
