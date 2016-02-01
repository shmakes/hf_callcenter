/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />
/// <reference path="../typings/hf_db_types.d.ts" />

export var VeteranDbDocs = new Mongo.Collection<VeteranDbDoc>('veteran_db_docs');

VeteranDbDocs.allow({
  insert: function() {
    // * Do not allow addition - veteran DB docs are only added via a server method.
    return false;
  },
  update: function(userId: string, doc: VeteranDbDoc, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin));

    if (allowed) {
      console.log('*** Updating Guardian DB Doc by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update Veteran DB Doc by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
