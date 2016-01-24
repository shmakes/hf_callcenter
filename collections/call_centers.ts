/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
 
export var CallCenters = new Mongo.Collection<CallCenter>('call_centers');

CallCenters.allow({
  insert: function(callCenter: Object) {
    var userIsSysAdmin = Meteor.call('currentUserIsSystemAdmin');
    return !!userIsSysAdmin;
  },
  update: function(callCenter: Object, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    if (userProfile && userProfile.isSystemAdmin) {
      console.log('*** Updating Call Center by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update Call Center by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return userProfile.isSystemAdmin;
  },
  remove: function(callCenter: Object) {
    // * Do not allow removal - soft delete using isRemoved to hide.
    //var user = Meteor.user();
    //return !!user;
    return false;
  }
});
