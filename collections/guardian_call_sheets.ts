/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />
/// <reference path="../typings/hf_db_types.d.ts" />

export var GuardianCallSheets = new Mongo.Collection<GuardianCallSheet>('guardian_call_sheets');

GuardianCallSheets.allow({
  insert: function() {
    // * Do not allow addition - guardian call sheets are only added via a server method.
    return false;
  },
  update: function(userId: string, doc: GuardianCallSheet, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    //TODO: Find the call packet for this sheet and see if the current user is the assigned caller.
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin));
//        || doc.callerId == userId));

    if (allowed) {
      console.log('*** Updating Guardian Call Sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update Guardian Call Sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
