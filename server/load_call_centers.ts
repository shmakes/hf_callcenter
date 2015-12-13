import {CallCenters} from 'collections/call_centers';
 
export function loadCallCenters() {
    if (CallCenters.find().count() === 0) {
 
    var parties = [
        {
            'name': 'Dubstep-Free Zone',
            'description': 'Can we please just for an evening not listen to dubstep.',
            'location': 'Palo Alto'
        },
        {
            'name': 'All dubstep all the time',
            'description': 'Get it on!',
            'location': 'Palo Alto'
        },
        {
            'name': 'Savage lounging',
            'description': 'Leisure suit required. And only fiercest manners.',
            'location': 'San Francisco'
        }
    ];
 
    for (var i = 0; i < parties.length; i++) {
        CallCenters.insert(parties[i]);
    }
  }
};
