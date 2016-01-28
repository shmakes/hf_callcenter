/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />
/// <reference path="../typings/hf_db_types.d.ts" />
 
export var VeteranCallSheets = new Mongo.Collection<VeteranCallSheet>('veteran_call_sheets');

VeteranCallSheets.allow({
  insert: function(callCenter: Object) {
    var userProfile = Meteor.call('currentUserProfile');
    return (userProfile && userProfile.isCenterAdmin);
  },
  update: function(callCenter: Object, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var assignedPacket = true; //TODO: Perform check here.
    if (userProfile && (userProfile.isCenterAdmin || assignedPacket)) {
      console.log('*** Updating veteran call sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update veteran call sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (userProfile && userProfile.isCenterAdmin);
  },
  remove: function(callPacket: Object) {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
