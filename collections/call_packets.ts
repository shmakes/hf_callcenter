export var CallPackets = new Mongo.Collection<CallPacket>('call_packets');

CallPackets.allow({
  insert: function() {
    // * Do not allow addition - call packets are only added via a server method.
    return false;
  },
  update: function(userId: string, doc: CallPacket, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile
      && (userProfile.isSystemAdmin
        || userProfile.isCenterAdmin
        || doc.callerId == userId));

    if (allowed) {
      console.log('*** Updating Call Packet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
      console.log(modifier);
    } else {
      console.log('*** Unauthorized attempt to update Call Packet by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
