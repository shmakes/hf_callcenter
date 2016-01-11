/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
 
export var CallCenters = new Mongo.Collection<CallCenter>('call_centers');

CallCenters.allow({
  insert: function(callCenter: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(callCenter: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(callCenter: Object) {
    // * Do not allow removal - soft delete using isRemoved to hide.
    //var user = Meteor.user();
    //return !!user;
    return false;
  }
});
