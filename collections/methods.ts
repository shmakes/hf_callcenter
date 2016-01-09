/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />
declare var process: any;
 
import {CallCenters} from './call_centers';
import {UserProfiles} from './user_profiles';
 
Meteor.methods({
  hfDbVersion: function() {
    console.log(HTTP.get(process.env.COUCH_URL).content);
  },
  hfAddCallCenter: function(callCenter: CallCenter) {
    var callerProfile = UserProfiles.findOne( { userId: this.userId } );
    var callerIsAdmin = (!!callerProfile && callerProfile.isAdmin);
    if (!callerIsAdmin) {
      throw new Meteor.Error('401', 'Only administrators can add new call centers.');
    }

    let options = { auth: process.env.COUCH_AUTH };
    let response = HTTP.get(process.env.COUCH_URL + '/' + process.env.COUCH_DB + '/_design/basic/_view/flights?descending=true&limit=5', options);
    let flightList = JSON.parse(response.content);
    let flights = flightList.rows;
    let flightId = '';
    for (var i in flights) {
      if (flights[i].key[1] == callCenter.flightName) {
        flightId = flights[i].id;
        break;
      }
    }
    if (!flightId) {
      throw new Meteor.Error('404', 'Flight name does not exist in the flight database.');
    }
    callCenter.flightId = flightId;
    CallCenters.insert(callCenter);
  },
  updateProfile: function(userProfile: UserProfile) {
    var callerProfile = UserProfiles.findOne( { userId: this.userId } );
    var callerIsAdmin = (!!callerProfile && callerProfile.isAdmin);

    if (callerIsAdmin) {
      UserProfiles.update(userProfile._id, {
        $set: {
          isAdmin: userProfile.isAdmin
        }
      });
    }
    UserProfiles.update(userProfile._id, {
      $set: {
        name: userProfile.name,
        phone: userProfile.phone,
        email: userProfile.email,
        updatedAt: new Date().toISOString()
      }
    });
  }
});
