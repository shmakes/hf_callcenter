/// <reference path="../typings/call_center.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />

import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';
import {CallStatus} from 'collections/enums';

export function initData() {

  if (CallCenters.find().count() === 0) {
    var callCenters = [
        {
          'name':       'April 2016',
          'startDate':   new Date().toISOString(),
          'endDate':     new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
          'flightName': 'SSHF-Apr2016',
          'flightId':   '6ee5e5c42cd34bc23225d2136601a14f',
          'createdBy':  'Sample',
          'isRemoved':  false,
          'callers':    []
        },
        {
          'name':       'May 2016',
          'startDate':  '2016-05-14T18:00:00.000Z',
          'endDate':    '2016-05-28T18:00:00.000Z',
          'flightName': 'SSHF-May2016',
          'flightId':   '6ee5e5c42cd34bc23225d2136601a9ed',
          'createdBy':  'Sample',
          'isRemoved':  false,
          'callers':    []
        }
    ];

    for (var i = 0; i < callCenters.length; i++) {
        CallCenters.insert(callCenters[i]);
    }
  }

  if (CallPackets.find().count() === 0) {
    var callCenter = CallCenters.findOne();
    var callPackets = [
        {
          'callCenterId':         callCenter._id,
          'callCenterName':       callCenter.name,
          'callerId':             '',
          'callerName':           '',
          'callerHistory':        new Array<CallerHistory>(),
          'veteranId':            '533f05df3485f3480ab8f41ca60159bd',
          'veteranName':          'Merlin Abler',
          'veteranStatus':        CallStatus.New,
          'guardianId':           '533f05df3485f3480ab8f41ca6069119',
          'guardianName':         'Lisa Abler',
          'guardianStatus':       CallStatus.New,
          'mailCallName':         '',
          'mailCallRelationship': '',
          'mailCallPhone':        '',
          'mailCallStatus':       CallStatus.New,
          'callStatusHistory':    new Array<CallStatusHistory>(),
          'createdAt':            new Date().toISOString(),
          'updatedAt':            new Date().toISOString(),
          'isRemoved':            false
        }
    ];

    for (var i = 0; i < callPackets.length; i++) {
        CallPackets.insert(callPackets[i]);
    }
  }
};
