/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />
/// <reference path="../typings/user_info.d.ts" />

declare var process: any;
 
import {CallCenters} from './call_centers';
import {UserProfiles} from './user_profiles';
 
Meteor.methods({
  addCallCenter: function(callCenter: CallCenter) {
    var currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    var currentUserIsSystemAdmin = (!!currentUserProfile && currentUserProfile.isSystemAdmin);

    if (!currentUserIsSystemAdmin) {
      throw new Meteor.Error('401', 'Only system administrators can add new call centers.');
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
    console.log('*** Call Center created by: ' + currentUserProfile.name + '\n' + JSON.stringify(callCenter, null, '\t') );
  },
  updateProfile: function(userProfile: UserProfile) {
    var currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    var currentUserIsSystemAdmin = (!!currentUserProfile && currentUserProfile.isSystemAdmin);

    if (currentUserIsSystemAdmin) {
      UserProfiles.update(userProfile._id, {
        $set: {
          isSystemAdmin: userProfile.isSystemAdmin,
          isCenterAdmin: userProfile.isCenterAdmin
        }
      });
    }
    UserProfiles.update(userProfile._id, {
      $set: {
        name: userProfile.name,
        phone: userProfile.phone,
        email: userProfile.email,
        updatedBy: currentUserProfile.name + ' (' + this.userId + ')',
        updatedAt: new Date().toISOString()
      }
    });
    console.log('*** User profile updated by: ' + currentUserProfile.name + '\n' + JSON.stringify(UserProfiles.findOne(userProfile._id), null, '\t') );
  },
  getPublicUserInfoForProfile: function(profileId: string) {
    var userProfile = UserProfiles.findOne( { _id: profileId } );
    var user = Meteor.users.findOne( { _id: userProfile.userId } );
    let name = '';
    let email = '';
    if (user.emails && user.emails.length > 0 && user.emails[0].address) {
      name = email = user.emails[0].address;
    }
    if (user.services && user.services.google) {
      name = user.services.google.name;
      email = user.services.google.email;
    }
    if (user.services && user.services.facebook) {
      name = user.services.facebook.name;
      email = user.services.facebook.email;
    }
    let userInfo = <UserInfo> {
      name: name,
      email: email,
      createdAt: new Date(user.createdAt).toISOString()
    }
    return userInfo;
  },
  getCallCenterName: function(callCenterId: string) {
    return CallCenters.findOne( { _id: callCenterId } ).name;
  }
});
