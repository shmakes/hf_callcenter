export var VeteranCallSheets = new Mongo.Collection<VeteranCallSheet>('veteran_call_sheets');

VeteranCallSheets.allow({
  insert: function() {
    // * Do not allow addition - veteran call sheets are only added via a server method.
    return false;
  },
  update: function(userId: string, doc: VeteranCallSheet, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    //TODO: Find the call packet for this sheet and see if the current user is the assigned caller.    
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin));
//        || doc.callerId == userId));

    if (allowed) {
      console.log('*** Updating Veteran Call Sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    } else {
      console.log('*** Unauthorized attempt to update Veteran Call Sheet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
