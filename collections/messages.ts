export var Messages = new Mongo.Collection<Message>('messages');

Messages.allow({
  insert: function(userId: string, doc: Message) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin
        || doc.callerId  == userId
        || doc.createdBy == userId));


    if (allowed) {
      console.log('*** Creating Message by: ' + userProfile.name + ' (' + userProfile.userId + ')');
      doc.createdAt = new Date().toISOString();
      doc.createdBy = userId;
      doc.createdName = userProfile.name;
    } else {
      console.log('*** Unauthorized attempt to create Message by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  update: function(userId: string, doc: Message, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin
        || doc.callerId  == userId
        || doc.createdBy == userId));


    if (allowed) {
      console.log('*** Updating Message by: ' + userProfile.name + ' (' + userProfile.userId + ')');
      modifier.$set.updatedAt = new Date().toISOString();
    } else {
      console.log('*** Unauthorized attempt to update Message by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
