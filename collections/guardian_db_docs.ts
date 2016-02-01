/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />
/// <reference path="../typings/hf_db_types.d.ts" />

export var GuardianDbDocs = new Mongo.Collection<GuardianDbDoc>('guardian_db_docs');

GuardianDbDocs.allow({
  insert: function() {
    // * Do not allow addition - guardian DB docs are only added via a server method.
    return false;
  },
  update: function(userId: string, doc: GuardianDbDoc, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin));

    if (allowed) {
      console.log('*** Updating Guardian DB Doc by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update Guardian DB Doc by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
