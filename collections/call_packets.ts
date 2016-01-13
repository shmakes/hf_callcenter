/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_packet.d.ts" />
 
export var CallPackets = new Mongo.Collection<CallPacket>('call_packets');

CallPackets.allow({
  insert: function(callPacket: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(callPacket: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(callPacket: Object) {
    // * Do not allow removal - soft delete using isRemoved to hide.
    //var user = Meteor.user();
    //return !!user;
    return false;
  }
});
