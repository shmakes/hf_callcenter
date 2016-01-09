/// <reference path="../typings/call_center.d.ts" />

import {CallCenters} from 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
 
export function loadCallCenters() {

  if (CallCenters.find().count() === 0) {
    var callCenters = [
        {
            'name':       'April 2016',
            'startDate':   new Date().toISOString(),
            'endDate':     new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
            'flightName': 'SSHF-Apr2016',
            'flightId':   '6ee5e5c42cd34bc23225d2136601a14f',
            'createdBy':  'Sample',
            'callers':    ['generated']
        },
        {
            'name':       'May 2016',
            'startDate':  '2016-05-14T18:00:00.000Z',
            'endDate':    '2016-05-28T18:00:00.000Z',
            'flightName': 'SSHF-May2016',
            'flightId':   '6ee5e5c42cd34bc23225d2136601a9ed',
            'createdBy':  'Sample',
            'callers':    []
        }
    ];

    for (var i = 0; i < callCenters.length; i++) {
        CallCenters.insert(callCenters[i]);
    }
  }

  if (UserProfiles.find().count() === 0) {
    var userProfiles = [
        {
            'userId':    'generated',
            'isAdmin':   true,
            'name':      'Admin',
            'phone':     '555-555-5555',
            'email':     'admin@example.com',
            'createdAt': new Date().toISOString(),
            'updatedAt': new Date().toISOString()
        }
    ];

    for (var i = 0; i < userProfiles.length; i++) {
        UserProfiles.insert(userProfiles[i]);
    }
  }
};
