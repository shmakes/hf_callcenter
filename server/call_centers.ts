/// <reference path="../typings/angular2-meteor.d.ts" />
 
import {CallCenters} from 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
 
Meteor.publish('callCenters', function() {
  var profile = UserProfiles.findOne( { userId: this.userId } );
  var isAdmin = (!!profile && profile.isAdmin);
  return isAdmin
          ? CallCenters.find() 
          : CallCenters.find( { 
              $and: [ 
                      { callers: { $exists: true } } , 
                      { callers: this.userId } 
                    ] 
          } );
});

Meteor.publish('userProfiles', function() {
  var profile = UserProfiles.findOne( { userId: this.userId } );
  var isAdmin = (!!profile && profile.isAdmin);
  return isAdmin
          ? UserProfiles.find() 
          : UserProfiles.find( { userId: this.userId } );
});
