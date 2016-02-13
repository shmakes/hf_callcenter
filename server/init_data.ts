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
          'callers':    [],
          'history':    [],
          'createdBy':  'Sample',
          'createdAt':   new Date().toISOString(),
          'updatedAt':   new Date().toISOString(),
          'isRemoved':  false

        },
        {
          'name':       'May 2016',
          'startDate':  '2016-05-14T18:00:00.000Z',
          'endDate':    '2016-05-28T18:00:00.000Z',
          'flightName': 'SSHF-May2016',
          'flightId':   '6ee5e5c42cd34bc23225d2136601a9ed',
          'callers':    [],
          'history':    [],
          'createdBy':  'Sample',
          'createdAt':   new Date().toISOString(),
          'updatedAt':   new Date().toISOString(),
          'isRemoved':  false
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
          'callerId':             'TnTEu8SgkvnhDYMfG',
          'callerName':           'Test Guy',
          'callerHistory':        new Array<CallerHistory>(),
          'veteranCallSheetId':   '1c376a8a16343a1feb5a6b9ba500b57e',
          'veteranDbId':          '1c376a8a16343a1feb5a6b9ba500b57e',
          'veteranFirstName':     'Frank',
          'veteranLastName':      'Salmieri',
          'veteranStatus':        CallStatus.Accepted,
          'guardianCallSheetId':  '1c376a8a16343a1feb5a6b9ba500c543',
          'guardianDbId':         '1c376a8a16343a1feb5a6b9ba500c543',
          'guardianFirstName':    'Michael',
          'guardianLastName':     'Mittelsteadt',
          'guardianStatus':       CallStatus.WrongNumber,
          'mailCallName':         'Patti Mittelsteadt',
          'mailCallRelationship': 'Daughter-in-law',
          'mailCallPhone':        '608-697-5973',
          'mailCallEmail':        'pmittle321@example.com',
          'mailCallStatus':       CallStatus.LeftMessage,
          'callStatusHistory':    new Array<CallStatusHistory>(),
          'createdAt':            new Date().toISOString(),
          'updatedAt':            new Date().toISOString(),
          'isRemoved':            false
        },
        {
          'callCenterId':         callCenter._id,
          'callCenterName':       callCenter.name,
          'callerId':             '',
          'callerName':           '',
          'callerHistory':        new Array<CallerHistory>(),
          'veteranCallSheetId':   '533f05df3485f3480ab8f41ca60159bd',
          'veteranDbId':          '1c376a8a16343a1feb5a6b9ba500b57e',
          'veteranFirstName':     'Merlin',
          'veteranLastName':      'Abler',
          'veteranStatus':        CallStatus.New,
          'guardianCallSheetId':  '533f05df3485f3480ab8f41ca6069119',
          'guardianDbId':         '1c376a8a16343a1feb5a6b9ba500c543',
          'guardianFirstName':    'Lisa',
          'guardianLastName':     'Abler',
          'guardianStatus':       CallStatus.New,
          'mailCallName':         '',
          'mailCallRelationship': '',
          'mailCallPhone':        '',
          'mailCallEmail':        '',
          'mailCallStatus':       CallStatus.New,
          'callStatusHistory':    new Array<CallStatusHistory>(),
          'createdAt':            new Date().toISOString(),
          'updatedAt':            new Date().toISOString(),
          'isRemoved':            false
        },
        {
          'callCenterId':         callCenter._id,
          'callCenterName':       callCenter.name,
          'callerId':             '',
          'callerName':           '',
          'callerHistory':        new Array<CallerHistory>(),
          'veteranCallSheetId':   '23a37919e7c22d6e995bba135d0a079a',
          'veteranDbId':          '1c376a8a16343a1feb5a6b9ba500b57e',
          'veteranFirstName':     'John',
          'veteranLastName':      'Delfield',
          'veteranStatus':        CallStatus.New,
          'guardianCallSheetId':  '',
          'guardianDbId':         '',
          'guardianFirstName':    '',
          'guardianLastName':     '',
          'guardianStatus':       CallStatus.New,
          'mailCallName':         '',
          'mailCallRelationship': '',
          'mailCallPhone':        '',
          'mailCallEmail':        '',
          'mailCallStatus':       CallStatus.New,
          'callStatusHistory':    new Array<CallStatusHistory>(),
          'createdAt':            new Date().toISOString(),
          'updatedAt':            new Date().toISOString(),
          'isRemoved':            false
        },
        {
          'callCenterId':         callCenter._id,
          'callCenterName':       callCenter.name,
          'callerId':             '',
          'callerName':           '',
          'callerHistory':        new Array<CallerHistory>(),
          'veteranCallSheetId':   '',
          'veteranDbId':          '',
          'veteranFirstName':     '',
          'veteranLastName':      '',
          'veteranStatus':        CallStatus.New,
          'guardianCallSheetId':  '6194e61566b7f2d8d30246614b008de7',
          'guardianDbId':         '1c376a8a16343a1feb5a6b9ba500c543',
          'guardianFirstName':    'Donna',
          'guardianLastName':     'Derse',
          'guardianStatus':       CallStatus.New,
          'mailCallName':         '',
          'mailCallRelationship': '',
          'mailCallPhone':        '',
          'mailCallEmail':        '',
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
